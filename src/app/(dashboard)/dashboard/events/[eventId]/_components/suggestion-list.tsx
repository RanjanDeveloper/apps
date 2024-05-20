import React from "react";

type SuggestionListProps = {
  suggestions: any[];
  isLoading: boolean;
  isSelectionOpen: boolean;
  handleSuggestClick: (suggestion: any) => void;
  renderSuggestion:(suggestion: any) => React.ReactNode,
};

const SuggestionList: React.FC<SuggestionListProps> = ({
  suggestions,
  isLoading,
  isSelectionOpen,
  handleSuggestClick,
  renderSuggestion,
}) => {
  return (
    <ul className="bg-white z-10 divide-y border max-h-32 rounded-md overflow-y-auto w-full left-0 top-[calc(100%+2px)] shadow p-2 text-sm absolute">
      {isLoading ? (
        <li className="text-center">Loading...</li>
      ) : suggestions.length === 0 ? (
        <li className="text-center">No results found</li>
      ) : (
        suggestions.map((suggestion: any, index: number) => (
          <li
            onClick={() => handleSuggestClick(suggestion)}
            className="flex justify-between cursor-pointer"
            key={index}
          >
            {renderSuggestion(suggestion)}
           
          </li>
        ))
      )}
    </ul>
  );
};

export default SuggestionList;
