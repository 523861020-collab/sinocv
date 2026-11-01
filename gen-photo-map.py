import os, json, re
from collections import defaultdict
from urllib.parse import quote

BASE = "/opt/truck-export/public/truck-photos"
# Use server public IP (YCloud needs publicly accessible URLs)
BASE_URL = "http://47.96.255.110:3000/truck-photos"

photo_map = defaultdict(list)

for root, dirs, files in os.walk(BASE):
    for f in files:
        if not re.match(r"^([1-6]|n[1-6])\.(jpg|JPG|jpeg|png)$", f):
            continue
        rel_path = os.path.relpath(os.path.join(root, f), BASE)
        parts = rel_path.split("/")
        if len(parts) >= 3:
            if re.search(r"\d[×x]\d", parts[2]):
                key = f"{parts[0]}/{parts[1]}/{parts[2]}"
            else:
                key = f"{parts[0]}/{parts[1]}"
        else:
            key = "/".join(parts[:-1])
        
        # URL-encode each path segment for non-ASCII chars
        encoded_parts = [quote(p) for p in parts]
        encoded_rel = "/".join(encoded_parts)
        url = f"{BASE_URL}/{encoded_rel}"
        num = f.split(".")[0]
        photo_map[key].append({"num": num, "url": url})

for key in photo_map:
    photo_map[key].sort(key=lambda x: (x["num"][0] != "n", x["num"]))

output = {k: v for k, v in sorted(photo_map.items())}
with open("/opt/truck-export/photo-map.json", "w") as fp:
    json.dump(output, fp, indent=2, ensure_ascii=False)

print(f"Generated {len(output)} categories")
for k in list(output.keys())[:10]:
    print(f"  {k}: {len(output[k])} photos")
print(f"\nSample URL: {output[list(output.keys())[0]][0]['url']}")
