import json
with open('5MB.json', 'r') as file:
    data = json.load(file)
for item in data:
    del item["bio"]

for i, item in enumerate(data, start=1):
    item_with_id = {"No.": i, **item}
    item.clear()
    item.update(item_with_id)

output_file = "output.json"
with open(output_file, "w") as f:
    json.dump(data, f)