export const toggleSearchBar = (
   showSearchBar: boolean,
   setShowSearchBar: (show: boolean) => void,
   setSearchQuery: (query: string) => void
) => {
   setShowSearchBar(!showSearchBar);
   setSearchQuery("");
};