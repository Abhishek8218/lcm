import { Search, X } from 'lucide-react';
import React, { forwardRef, useState, useImperativeHandle, ChangeEvent, useEffect, useRef } from 'react';



type SearchBarProps = {
  suggestions: string[];
  onSelect: (value: string) => void;
};

type SearchBarHandle = {
  focus: () => void;
};

const SearchBar = forwardRef<SearchBarHandle, SearchBarProps>(
  ({ suggestions, onSelect }, ref) => {
    const [query, setQuery] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const [error, setError] = useState<string | null>(null);
    const [justSelected, setJustSelected] = useState(false);

    const searchBarRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        const input = document.getElementById('search-input') as HTMLInputElement;
        input?.focus();
      }
    }));

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
      setQuery('');

      const input = document.getElementById('search-input') as HTMLInputElement;
      if (input) {
        input.blur();
        setTimeout(() => {
          input.focus();
        }, 100);
      }
    };

    return (
      <div ref={searchBarRef} className="relative w-full max-w-md mx-auto">
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={handleChange}
          className="w-[350px] flex gap-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="Search..."
        />
 
       {query && <div className="absolute right-0 top-0 flex flex-row gap-1 p-2"><X  size={24} color='#B4B4B8' onClick={() => setQuery('')}/><span className=' text-[#B4B4B8]'>|</span><Search  size={24} color='#B4B4B8'/></div>} 
      {!query && <div className="absolute right-0 top-0 p-2"><Search  size={24} color='#B4B4B8'/></div>}
        {error && <div className="text-sm text-red-500 mt-1">{error}</div>}
        {showSuggestions && (
          <ul className="absolute max-h-[300px] overflow-y-scroll overflow-x-hidden w-[350px] mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
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
          <span key={index} className="text-gray-400 font-semibold">{part}</span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
};

export default SearchBar;