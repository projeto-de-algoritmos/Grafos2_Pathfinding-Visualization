class Solution:
    def networkDelayTime(self, times: List[List[int]], n: int, k: int) -> int:
        weights = {}
        d = defaultdict(list)
        for source, destination, weight in times:
            d[source].append((destination, weight))
        q = [(0,k)]
        heapq.heapify(q)
        while q:
            time, node = heapq.heappop(q)
            if node not in weights:
                weights[node] = time
                for adj, w in d[node]:
                    heapq.heappush(q, (time + w, adj))
        return max(weights.values()) if len(weights) == n else -1