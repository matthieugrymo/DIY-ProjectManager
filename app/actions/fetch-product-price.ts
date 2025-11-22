"use server"

export async function fetchProductPrice(url: string) {
  try {
    // Basic validation
    if (!url.includes("leroymerlin.fr")) {
      return { error: "Veuillez utiliser une URL leroymerlin.fr valide" }
    }

    // Fetch the page content
    // Note: This might be blocked by bot protection in production environments
    // We're adding headers to try to mimic a browser
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (response.status === 403) {
      return {
        error: "Protection anti-bot activée. Veuillez saisir le prix manuellement.",
        isProtected: true,
      }
    }

    if (!response.ok) {
      return { error: "Impossible d'accéder à la page produit" }
    }

    const html = await response.text()

    // Strategy 1: JSON-LD Structured Data (Most reliable)
    const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
    let match
    while ((match = jsonLdRegex.exec(html)) !== null) {
      try {
        const data = JSON.parse(match[1])
        // Check for Product schema
        if (data["@type"] === "Product" || data["@context"] === "http://schema.org") {
          if (data.offers && data.offers.price) {
            return {
              price: Number.parseFloat(data.offers.price),
              name: data.name,
              currency: data.offers.priceCurrency || "EUR",
            }
          }
        }
      } catch (e) {
        continue
      }
    }

    // Strategy 2: Meta tags
    const ogPrice = html.match(/property="product:price:amount" content="([^"]+)"/)
    if (ogPrice && ogPrice[1]) {
      return { price: Number.parseFloat(ogPrice[1]) }
    }

    const twitterPrice = html.match(/name="twitter:data1" content="([^"]+)"/)
    if (twitterPrice && twitterPrice[1]) {
      // Remove currency symbol if present
      const priceStr = twitterPrice[1].replace(/[^0-9.,]/g, "").replace(",", ".")
      return { price: Number.parseFloat(priceStr) }
    }

    // Strategy 3: Regex for common price patterns in HTML
    // Look for price near '€' or 'EUR'
    const priceRegex = /class="[^"]*price[^"]*"[^>]*>[\s\n]*([0-9,.]+)[\s\n]*[€]/i
    const priceMatch = html.match(priceRegex)
    if (priceMatch && priceMatch[1]) {
      return { price: Number.parseFloat(priceMatch[1].replace(",", ".")) }
    }

    return { error: "Impossible de détecter le prix automatiquement. Veuillez le saisir manuellement." }
  } catch (error) {
    console.error("Error fetching price:", error)
    return { error: "Erreur lors de la récupération des données" }
  }
}
