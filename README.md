# Shrink_DAG
Shrinking and unfolding mechanism of directed acyclic graph
## Algorithm
1. Count the number of times a node is marked for deletion by the upstream link:
   According to the node out-degree adjacency table, count the number of times that all child nodes flowing down from the target node (target) are marked for deletion by the upstream link.
2. Count the points that are actually to be hidden and deleted:
   When the number of times a node is notified of deletion is equal to the number of in-degrees of the node in the in-degree table, it proves that this point needs to be removed.
3. Count the edges to be hidden and deleted:
   When an edge is on the way to send a signal to a point, the edge will be removed.
4. Filter the full graph cache to obtain the required points and edges:
   The points and edges presented in the final graph are Among the vertex edges of the currently displayed graph, filter out the vertex edges to be deleted.
## Usage
Click the nodes directly will trigger the shrinking or unfolding mechanism of this node.

<img width="1464" alt="Screenshot 2024-04-06 at 8 08 24 AM" src="https://github.com/LexieZhou/Shrink_DAG/assets/78584281/40e29e41-738d-4497-b5d2-0e32a275193c">
