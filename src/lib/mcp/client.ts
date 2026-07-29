/**
 * Cliente HTTP/JSON-RPC para consumir la API del MCP de IKASI
 * Endpoint Oficial: https://inventorydb-mcp.industrialrealtor.app/mcp
 */

export interface NormalizedProperty {
  property_code: string;
  title: string;
  type: string;
  location: string;
  surface_area: number | null;
  height_m: number | null;
  loading_docks: number | null;
  ramps: number | null;
  kva: number | null;
  price_note: string | null;
  raw: Record<string, unknown>;
}

/**
 * Normalizador Profesional de Fichas Técnicas del MCP de IKASI
 * Extrae campos con fallback multilingüe (Español / Inglés) y estructuras anidadas (structuredContent / units).
 */
export function normalizePropertyData(rawResponse: Record<string, unknown>): NormalizedProperty {
  // Manejar respuesta estándar FastMCP / MCP Protocol donde el JSON viene dentro de result.content[0].text
  let root: Record<string, unknown> = rawResponse;

  if (rawResponse.result && typeof rawResponse.result === 'object') {
    const resObj = rawResponse.result as Record<string, unknown>;
    if (Array.isArray(resObj.content) && resObj.content.length > 0) {
      const firstContent = resObj.content[0] as Record<string, unknown>;
      if (firstContent.type === 'text' && typeof firstContent.text === 'string') {
        try {
          root = JSON.parse(firstContent.text) as Record<string, unknown>;
        } catch {
          root = resObj;
        }
      }
    } else {
      root = resObj;
    }
  }

  if (root.structuredContent && typeof root.structuredContent === 'object') {
    root = root.structuredContent as Record<string, unknown>;
  }

  const prop = (root.property || root) as Record<string, unknown>;
  const units = Array.isArray(root.units) && root.units.length > 0 ? (root.units[0] as Record<string, unknown>) : {};

  // Auxiliar para buscar en una lista de llaves candidatas
  const getField = <T>(objA: Record<string, unknown>, objB: Record<string, unknown>, keys: string[]): T | null => {
    for (const key of keys) {
      if (objA && objA[key] !== undefined && objA[key] !== null) return objA[key] as T;
      if (objB && objB[key] !== undefined && objB[key] !== null) return objB[key] as T;
    }
    return null;
  };

  const property_code = String(
    getField(prop, root, ['property_code', 'code', 'codigo', 'codigo_propiedad']) || 'N/A'
  );

  const title = String(
    getField(prop, root, ['commercial_title', 'title', 'property_name', 'nombre', 'titulo']) || 'Propiedad Industrial'
  );

  const type = String(
    getField(prop, units, ['asset_category', 'unit_type', 'type', 'tipo', 'categoria']) || 'Industrial'
  );

  const location = String(
    getField(prop, root, ['address', 'industrial_park', 'location', 'ubicacion', 'direccion']) || 'No especificada'
  );

  const surface_area = getField<number>(units, root, ['available_area_m2', 'surface_area', 'superficie_m2', 'area_m2', 'available_area']);
  const height_m = getField<number>(units, root, ['clear_height_m', 'height_m', 'altura_m', 'altura']);
  const loading_docks = getField<number>(units, root, ['dock_doors', 'loading_docks', 'andenes', 'puertas_anden']);
  const ramps = getField<number>(units, root, ['ramps', 'rampas']);
  const kva = getField<number>(units, root, ['kva', 'power_kva', 'energia_kva', 'capacidad_kva']);
  const price_note = getField<string>(units, prop, ['price_note', 'price', 'precio', 'nota_precio']);

  return {
    property_code,
    title,
    type,
    location,
    surface_area: surface_area !== null ? Number(surface_area) : null,
    height_m: height_m !== null ? Number(height_m) : null,
    loading_docks: loading_docks !== null ? Number(loading_docks) : null,
    ramps: ramps !== null ? Number(ramps) : null,
    kva: kva !== null ? Number(kva) : null,
    price_note: price_note ? String(price_note) : null,
    raw: rawResponse,
  };
}

export interface MCPResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class IkasiMCPClient {
  private endpoint: string;
  private token: string;

  constructor() {
    this.endpoint = process.env.MCP_INVENTORY_URL || process.env.IKASI_MCP_ENDPOINT || 'https://inventorydb-mcp.industrialrealtor.app/mcp';
    this.token = process.env.MCP_INVENTORY_TOKEN || process.env.IKASI_MCP_BEARER_TOKEN || '';
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  /**
   * Herramienta 1: get_property_detail
   * Consulta el detalle de una propiedad por su código público (ej. BIR-590)
   */
  async getPropertyDetail(propertyCode: string): Promise<MCPResponse<NormalizedProperty>> {
    if (!this.token) {
      return {
        success: false,
        error: 'IKASI_MCP_BEARER_TOKEN no configurado en el servidor.',
      };
    }

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: {
            name: 'get_property_detail',
            arguments: {
              property_code: propertyCode.toUpperCase().trim(),
            },
          },
        }),
      });

      const responseText = await response.text();
      let json;
      try {
        json = JSON.parse(responseText);
      } catch {
        json = null;
      }

      if (!response.ok) {
        const errorMsg = json?.error?.message || json?.detail || responseText || `${response.status} ${response.statusText}`;
        return {
          success: false,
          error: `Error HTTP ${response.status}: ${typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg}`,
        };
      }

      return {
        success: true,
        data: normalizePropertyData(json),
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Error desconocido al conectar con el MCP de IKASI',
      };
    }
  }

  /**
   * Herramienta 2: search_space_need
   * Consulta inventario por lenguaje natural (ej. "bodega de 500 m2 en León")
   */
  async searchSpaceNeed(query: string): Promise<MCPResponse<NormalizedProperty[]>> {
    if (!this.token) {
      return {
        success: false,
        error: 'IKASI_MCP_BEARER_TOKEN no configurado en el servidor.',
      };
    }

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          method: 'tools/call',
          params: {
            name: 'search_space_need',
            arguments: {
              query,
            },
          },
        }),
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Error HTTP del MCP: ${response.status} ${response.statusText}`,
        };
      }

      const json = await response.json();
      return {
        success: true,
        data: json.result || json.data || json,
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Error al buscar en el MCP',
      };
    }
  }
}

export const mcpClient = new IkasiMCPClient();
