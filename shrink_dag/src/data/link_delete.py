import json

# Load the JSON data from the file
# with open('links.json', 'r') as file:
#     data = json.load(file)

import random
with open('links.json', 'r') as file:
    data = json.load(file)

def delete_link_with_loop(links):
    explored = set()
    explored.add(links[0]['source'])
    new_links = []

    # def has_cycle(node_id):
    #     if node_id in stack:
    #         return True  # Cycle detected

    #     if node_id in visited:
    #         return False  # Already visited, no cycle

    #     visited.add(node_id)
    #     stack.add(node_id)

    #     node_links = [link for link in links if link["source"] == node_id]
    #     for link in node_links:
    #         if has_cycle(link["target"]):
    #             return True

    #     stack.remove(node_id)
    #     return False

    for link in links:
        if link['source'] in explored and link['target'] in explored:
            continue
        else:
            explored.add(link['source'])
            explored.add(link['target'])
            new_links.append(link)

    return new_links

def remove_duplicate_links(links):
    new_links = []
    for i in range(len(links)):
        linkA = links[i]
        duplicate_found = False
        if linkA['source'] == linkA['target']:
            duplicate_found = True
        for j in range(i + 1, len(links)):
            linkB = links[j]
            if (linkA['source'] == linkB['target'] and linkA['target'] == linkB['source']) or \
               (linkA['target'] == linkB['source'] and linkA['source'] == linkB['target']):
                duplicate_found = True
                break
        if not duplicate_found:
            new_links.append(linkA)
    return new_links

updated_links = delete_link_with_loop(data)
unique_links = remove_duplicate_links(updated_links)

# Write the updated links to a new JSON file
output_file = "updated_links.json"
with open(output_file, "w") as f:
    json.dump(unique_links, f, indent=4)

print("Updated links have been written to", output_file)