import json

# Load the JSON data from the file
# with open('links.json', 'r') as file:
#     data = json.load(file)

import random
with open('users_1k.json', 'r') as file:
    data = json.load(file)

filtered_data = []

for entry in data:
    if len(filtered_data) == 40:
        break

    entry.pop("friends", None)  # Remove the 'friends' key from each entry
    filtered_data.append(entry)

# Store the filtered data in a new JSON file
with open('filtered_users_data.json', 'w') as file:
    json.dump(filtered_data, file, indent=4)