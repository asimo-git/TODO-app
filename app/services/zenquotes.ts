interface Quote {
  q: string;
  a: string;
}

const QUOTE_API_URL = "https://zenquotes.io/api/today/";

export async function fetchQuote(): Promise<string> {
  try {
    const response = await fetch(QUOTE_API_URL, {
      next: { revalidate: 86400 }, // 86400 секунд - 24 часа
    });
    const data: Quote[] = await response.json();
    return data[0]["q"];
  } catch (error) {
    console.error("Ошибка при получении цитаты:", error);
    return "If you can dream it, you can do it";
  }
}
