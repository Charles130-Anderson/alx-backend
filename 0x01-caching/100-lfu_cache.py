#!/usr/bin/env python3
""" LFUCache module
"""

from base_caching import BaseCaching
from collections import defaultdict, OrderedDict


class LFUCache(BaseCaching):
    """ LFUCache defines a LFU caching system """

    def __init__(self):
        """ Initialize the cache """
        super().__init__()
        self.frequency = defaultdict(int)
        self.lru_order = OrderedDict()
        self.freq_order = defaultdict(OrderedDict)

    def put(self, key, item):
        """ Add an item in the cache """
        if key is None or item is None:
            return

        if key in self.cache_data:
            self.lru_order.pop(key)
            self.freq_order[self.frequency[key]].pop(key)
        elif len(self.cache_data) >= BaseCaching.MAX_ITEMS:
            self.evict()

        self.cache_data[key] = item
        self.frequency[key] += 1
        self.lru_order[key] = None
        self.freq_order[self.frequency[key]][key] = None

    def get(self, key):
        """ Get an item by key """
        if key is None or key not in self.cache_data:
            return None
        
        self.frequency[key] += 1
        self.lru_order.move_to_end(key)
        
        # Update frequency and move to new frequency order
        old_freq = self.frequency[key] - 1
        if old_freq in self.freq_order:
            self.freq_order[old_freq].pop(key)
            if not self.freq_order[old_freq]:
                del self.freq_order[old_freq]
        
        self.freq_order[self.frequency[key]][key] = None
        
        return self.cache_data[key]

    def evict(self):
        """ Evict the least frequently used item """
        if not self.freq_order:
            return
        
        min_freq = min(self.freq_order.keys())
        lfu_items = list(self.freq_order[min_freq].keys())
        
        if len(lfu_items) > 1:
            lru_key = next(iter(self.lru_order))
            while lru_key not in lfu_items:
                lru_key = next(iter(self.lru_order))
        else:
            lru_key = lfu_items[0]

        self.cache_data.pop(lru_key)
        self.frequency.pop(lru_key)
        self.lru_order.pop(lru_key)
        self.freq_order[min_freq].pop(lru_key)
        if not self.freq_order[min_freq]:
            del self.freq_order[min_freq]
        
        print(f"DISCARD: {lru_key}")
