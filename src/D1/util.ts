export function D1DatabaseLiteralClient(d1: D1Database){
  return function sql(strings: string[], ...exp: unknown[]) {
    const query = strings.join("?");
    return d1.prepare(query).bind(...exp);
  }
}