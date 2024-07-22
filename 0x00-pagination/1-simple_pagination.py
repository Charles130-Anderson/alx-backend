#!/usr/bin/env python3
"""
This module contains a Server class to
paginate a database of popular baby names.
"""

import csv
from typing import List, Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """
    Return a tuple of size two containing a start index and an end index
    corresponding to the range of indexes to return in a list for the given
    pagination parameters.

    Parameters:
    page (int): The current page number (1-indexed).
    page_size (int): The number of items per page.

    Returns:
    Tuple[int, int]: A tuple containing the start and end indexes.
    """
    start_index = (page - 1) * page_size
    end_index = start_index + page_size
    return start_index, end_index


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """
        Get a page from the dataset.

        Parameters:
        page (int): The current page number (1-indexed).
        page_size (int): The number of items per page.

        Returns:
        List[List]: The appropriate page of the dataset.
        """
        # Check that page is a positive integer
        if not isinstance(page, int):
            raise AssertionError("Page must be an integer greater than 0")
        if page <= 0:
            raise AssertionError("Page must be an integer greater than 0")
        # Check that page_size is a positive integer
        if not isinstance(page_size, int):
            raise AssertionError("Page size must be an integer greater than 0")
        if page_size <= 0:
            raise AssertionError("Page size must be an integer greater than 0")

        start_index, end_index = index_range(page, page_size)
        dataset = self.dataset()
        if start_index >= len(dataset):
            return []
        return dataset[start_index:end_index]
