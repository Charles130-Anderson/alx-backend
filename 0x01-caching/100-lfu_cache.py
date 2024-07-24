#!/usr/bin/env python3
""" LFUCache module
"""

from base_caching import BaseCaching
from collections import defaultdict


class LFUCache(BaseCaching):
    """ LFUCache defines a LFU caching system """

    def __init__(self):
        """ Initialize the cache """
        super().__init__()
        self.frequency = defaultdict(int)
        self.usage_order = []

    def put(self, key, item):
        """ Add an item in the cache """
        if key is None or item is None:
            return

        if key in self.cache_data:
            self.usage_order.remove(key)
        self.cache_data[key] = item
        self.frequency[key] += 1
        self.usage_order.append(key)

        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            lfu_items = [k for k, v in self.frequency.items() if v == min(self.frequency.values())]
            if len(lfu_items) == 1:
                lfu_key = lfu_items[0]
            else:
                for k in self.usage_order:
                    if k in lfu_items:
                        lfu_key = k
                        break

            del self.cache_data[lfu_key]
            del self.frequency[lfu_key]
            self.usage_order.remove(lfu_key)
            print(f"DISCARD: {lfu_key}")

    def get(self, key):
        """ Get an item by key """
        if key is None or key not in self.cache_data:
            return None
        self.frequency[key] += 1
        self.usage_order.remove(key)
        self.usage_order.append(key)
        return self.cache_data[key]
