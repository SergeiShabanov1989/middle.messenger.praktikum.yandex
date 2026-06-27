const ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
};

/**
 * Экранирует HTML-спецсимволы в строке, предотвращая XSS.
 * Используется при прямой записи пользовательских данных в DOM (innerHTML).
 * В Handlebars-шаблонах достаточно двойных скобок {{ }}.
 */
export function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (ch) => ESCAPE_MAP[ch] ?? ch);
}
