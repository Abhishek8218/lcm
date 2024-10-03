import { Search, X } from 'lucide-react';
import React, { forwardRef, useState, ChangeEvent, useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { sheetState } from './bottomSheet/useModal';

type SearchBarProps = {
  suggestions: string[];
  onSelect: (value: string) => void;
  inputClassName?: string; // New prop for input class
  wrapperClassName?: string; // New prop for wrapper div class
};

type SearchBarHandle = {
  focus: () => void;
};

const SearchBar = forwardRef<SearchBarHandle, SearchBarProps>(
  ({ suggestions, onSelect, inputClassName, wrapperClassName }) => {
    const [query, setQuery] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const [error, setError] = useState<string | null>(null);
    const [justSelected, setJustSelected] = useState(false);
    const [isSheetOpen] = useRecoilState(sheetState); // Added state for bottom sheet

    const searchBarRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null); // Manage input focus manually

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedQuery(query);
      }, 300);

      return () => {
        clearTimeout(handler);
      };
    }, [query]);

    useEffect(() => {
      if (debouncedQuery && !justSelected) {
        const fetchSuggestions = async () => {
          try {
            if (debouncedQuery === 'error') {
              throw new Error('500 Internal Server Error');
            }

            setFilteredSuggestions(
              suggestions.filter((suggestion) =>
                suggestion.toLowerCase().includes(debouncedQuery.toLowerCase())
              )
            );
            setTimeout(() => {
              setShowSuggestions(debouncedQuery.length > 0);
            }, 100);
            setError(null); // Clear error if successful
          } catch (e) {
            setError('500 Internal Server Error');
          }
        };
        fetchSuggestions();
      } else {
        setFilteredSuggestions([]);
        setShowSuggestions(false);
        setError(null);
      }
    }, [debouncedQuery, suggestions, justSelected]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
          setShowSuggestions(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    useEffect(() => {
      if (isSheetOpen && inputRef.current) {
        inputRef.current.blur();
      }
    }, [isSheetOpen]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (justSelected) {
        setJustSelected(false);
        return;
      }
      setQuery(e.target.value);
    };

    const handleSelect = (value: string) => {
      setQuery(value);
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      setJustSelected(true);
      onSelect(value);

      if (inputRef.current) {
        inputRef.current.blur(); // Ensure the input is blurred
      }
    };

    return (
      <div
        className={`relative flex justify-center items-center w-full max-w-md mx-auto ${
          wrapperClassName || ''
        }`}
        ref={searchBarRef}
      >
        <div className={`relative w-[350px] ${wrapperClassName || ''}`}>
          <input
            ref={inputRef}
            id="search-input"
            type="text"
            value={query}
            onChange={handleChange}
            className={`w-[350px] flex gap-10 px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 ${
              inputClassName || ''
            }`}
            placeholder="Search..."
          />

          {query && (
            <div className="absolute right-0 top-1 flex flex-row gap-1 p-2">
              <X size={20} color="#B4B4B8" onClick={() => setQuery('')} />
              <span className="text-[#B4B4B8] -mt-1">|</span>
              <Search size={20} color="#B4B4B8" />
            </div>
          )}
          {!query && (
            <div className="absolute right-0 top-1 p-2">
              <Search size={20} color="#B4B4B8" />
            </div>
          )}
        </div>
        {error && <div className="text-sm text-red-500 mt-1">{error}</div>}
        {showSuggestions && (
          <ul className="absolute max-h-[300px] top-10 overflow-y-scroll overflow-x-hidden w-[350px] mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelect(suggestion)}
                >
                  <HighlightedText text={suggestion} query={query} />
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No suggestions</li>
            )}
          </ul>
        )}
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';

type HighlightedTextProps = {
  text: string;
  query: string;
};

const HighlightedText = ({ text, query }: HighlightedTextProps) => {
  if (!query) return <>{text}</>;

  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={index} className="text-gray-400 font-semibold">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
};

export default SearchBar;
