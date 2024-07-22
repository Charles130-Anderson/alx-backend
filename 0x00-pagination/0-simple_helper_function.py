#!/usr/bin/env python3
"""
This module contains a helper function for pagination.
"""

from typing import Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """
    Return a tuple of size two containing a
    start index and an end index
    corresponding to the range of indexes to
    return in a list for the given
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
