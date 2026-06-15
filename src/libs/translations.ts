export const teamNames: Record<string, string> = {
  "United States": "Estados Unidos",
  Canada: "Canadá",
  Mexico: "México",
  Panama: "Panamá",

  Argentina: "Argentina",
  Chile: "Chile",
  Peru: "Perú",
  Australia: "Australia",

  Brazil: "Brasil",
  Colombia: "Colombia",
  Ecuador: "Ecuador",
  Japan: "Japón",

  France: "Francia",
  Belgium: "Bélgica",
  Germany: "Alemania",
  Portugal: "Portugal",

  Spain: "España",
  Netherlands: "Países Bajos",
  Croatia: "Croacia",
  Uruguay: "Uruguay",

  England: "Inglaterra",
  Sweden: "Suecia",
  Tunisia: "Túnez",
  Slovakia: "Eslovaquia",

  Morocco: "Marruecos",
  Senegal: "Senegal",
  "South Korea": "Corea del Sur",
  "New Zealand": "Nueva Zelanda",

  Poland: "Polonia",
  Serbia: "Serbia",
  "Costa Rica": "Costa Rica",

  // Otros que pueden aparecer
  "Saudi Arabia": "Arabia Saudita",
  Iran: "Irán",
  Switzerland: "Suiza",
  Denmark: "Dinamarca",
  Austria: "Austria",
  Turkey: "Turquía",
  Venezuela: "Venezuela",
  Bolivia: "Bolivia",
  Paraguay: "Paraguay",
  Nigeria: "Nigeria",
  Ghana: "Ghana",
  Cameroon: "Camerún",
  Egypt: "Egipto",
  Algeria: "Argelia",
  "South Africa": "Sudáfrica",
  Ukraine: "Ucrania",
  "Czech Republic": "República Checa",
  Hungary: "Hungría",
  Romania: "Rumania",
  Wales: "Gales",
  Scotland: "Escocia",
  Russia: "Rusia",
  China: "China",
  Indonesia: "Indonesia",
  Thailand: "Tailandia",
  "Ivory Coast": "Costa de Marfil",
};

// Si no encuentra traducción, devuelve el nombre original
export function translateTeam(name: string): string {
  return teamNames[name] ?? name;
}
