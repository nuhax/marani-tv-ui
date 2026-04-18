export interface Channel {
  id: string;
  name: string;
  logo: string;
  url: string;
  category: string;
  group: string;
  isLive?: boolean;
}

export const M3U_URLS = [
  { name: "UK", url: "https://iptv-org.github.io/iptv/countries/gb.m3u" },
  { name: "USA", url: "https://iptv-org.github.io/iptv/countries/us.m3u" },
  { name: "Spain", url: "https://iptv-org.github.io/iptv/countries/es.m3u" },
  { name: "France", url: "https://iptv-org.github.io/iptv/countries/fr.m3u" },
  { name: "Italy", url: "https://iptv-org.github.io/iptv/countries/it.m3u" },
  { name: "Sports", url: "https://iptv-org.github.io/iptv/categories/sports.m3u" },
  { name: "Soccer", url: "https://iptv-org.github.io/iptv/categories/soccer.m3u" },
  { name: "Basketball", url: "https://iptv-org.github.io/iptv/categories/basketball.m3u" },
  { name: "Tennis", url: "https://iptv-org.github.io/iptv/categories/tennis.m3u" },
  { name: "Motorsport", url: "https://iptv-org.github.io/iptv/categories/motorsport.m3u" },
  { name: "Combat", url: "https://iptv-org.github.io/iptv/categories/combat_sports.m3u" },
];

export const parseM3U = async (url: string, categoryName: string): Promise<Channel[]> => {
  try {
    const response = await fetch(url);
    const text = await response.text();
    // Use character codes to avoid escaped character issues in sandbox
    const lines = text.split(String.fromCharCode(10));
    const channels: Channel[] = [];
    
    let currentChannel: Partial<Channel> = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith("#EXTINF:")) {
        const nameMatch = line.match(/,(.*)$/);
        const logoMatch = line.match(/tvg-logo="([^"]*)"/);
        const groupMatch = line.match(/group-title="([^"]*)"/);
        
        currentChannel.name = nameMatch ? nameMatch[1].trim() : "Unknown Channel";
        currentChannel.logo = logoMatch ? logoMatch[1] : "";
        currentChannel.group = groupMatch ? groupMatch[1] : categoryName;
        currentChannel.category = categoryName;
        currentChannel.isLive = true; // All IPTV streams are considered live by default
      } else if (line.startsWith("http")) {
        currentChannel.url = line;
        currentChannel.id = Math.random().toString(36).substring(2, 9);
        if (currentChannel.name && currentChannel.url) {
          channels.push(currentChannel as Channel);
        }
        currentChannel = {};
      }
    }
    
    return channels;
  } catch (error) {
    console.error("Error parsing M3U:", error);
    return [];
  }
};