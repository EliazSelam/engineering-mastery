import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  const key = 'test-key';
  const initialValue = { foo: 'bar' };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with initialValue if localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage(key, initialValue));
    expect(result.current[0]).toEqual(initialValue);
  });

  it('should initialize with value from localStorage if it exists', () => {
    const existingValue = { greeting: 'hello' };
    localStorage.setItem(key, JSON.stringify(existingValue));
    
    const { result } = renderHook(() => useLocalStorage(key, initialValue));
    expect(result.current[0]).toEqual(existingValue);
  });

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage(key, initialValue));
    const newValue = { foo: 'updated' };

    act(() => {
      result.current[1](newValue);
    });

    expect(result.current[0]).toEqual(newValue);
    expect(JSON.parse(localStorage.getItem(key)!)).toEqual(newValue);
  });
});
