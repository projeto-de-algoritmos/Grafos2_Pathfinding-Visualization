class Solution:
  def maxProbability(self, n: int, edges: List[List[int]], 
                     succProb: List[float], start: int, end: int) -> float:
    g = [[] for _ in range(n)]
    for i, e in enumerate(edges):
      g[e[0]].append((e[1], -math.log(succProb[i])))
      g[e[1]].append((e[0], -math.log(succProb[i])))
    seen = [False] * n
    dist = [float('inf')] * n
    dist[start] = 0.0
    q = [(dist[start], start)]
    while q:
      _, u = heapq.heappop(q)
      if seen[u]: continue
      seen[u] = True
      if u == end: return math.exp(-dist[u])
      for v, w in g[u]:
        if seen[v] or dist[u] + w > dist[v]: continue
        dist[v] = dist[u] + w        
        heapq.heappush(q, (dist[v], v))
    return 0
