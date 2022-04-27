import React, { useEffect, useState } from 'react';
import {
  PageSection,
  Text,
  PageSectionVariants,
  TextContent,
  Flex,
  FlexItem,
  Button,
  SelectOption,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarFilter,
  Select,
  SelectVariant,
} from '@patternfly/react-core';
import { useHistory, useLocation } from 'react-router-dom';
import { EngagementStatus } from '../../schemas/engagement';
import { EngagementSortFields } from '../../schemas/engagement_filter';
import { EngagementList } from '../../components/engagement_list/engagement_list';
import { Feature } from '../../components/feature/feature';
import { useFeedback } from '../../context/feedback_context/feedback_context';
import { useServiceProviders } from '../../context/service_provider_context/service_provider_context';
import { useEngagementCollection } from '../../hooks/engagement_collection_hook';
import { useEngagementFormConfig } from '../../context/engagement_config_context/engagement_config_hook';
import { FilterIcon, GlobeIcon, LongArrowAltDownIcon, LongArrowAltUpIcon, SortAmountDownIcon } from '@patternfly/react-icons';
import { AdvancedSearchInput } from '../../components/engagement_filter_bar/components/advanced_search_input';

export interface EngagementListRouteProps {
  title?: string;
  subtitle?: string;
}

const useEngagementFilter = () => {
  const history = useHistory();
  const location = useLocation();
  
  const [regions, setRegions] = useState(() => {
    const search = new URLSearchParams(location.search);
    const initialState = search.get('regions') ? search.get('regions').split(',') : [];
    return initialState;
  });

  const [isRegionExpanded, setRegionExpanded] = useState<boolean>(false);
  const [regionChips, setRegionChips] = useState<Map<string,string>>(new Map<string,string>())

  const [types, setTypes] = useState(() => {
    const search = new URLSearchParams(location.search);
    const initialState = search.get('types') ? search.get('types').split(',') : [];
    return initialState;
  });

  const [isTypeExpanded, setTypeExpanded] = useState<boolean>(false);
  const [typeChips, setTypeChips] = useState<Map<string,string>>(new Map<string,string>());

  const [statii, setStatus] = useState(() => {
    const search = new URLSearchParams(location.search);
    const states = search.get('statii') ? search.get('statii').split(',') : [];
    const initialState: EngagementStatus[] = [];
    states.forEach(st => initialState.push(EngagementStatus[st]));

    if(states.length === 0) {
      const pathState = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
      if("past" === pathState) {
        initialState.push(EngagementStatus[pathState]);
        initialState.push(EngagementStatus["terminating"]);
      } else if("all" !== pathState) {
        initialState.push(EngagementStatus[pathState]);
      }
    }

    return initialState;
  });

  const [isStatusExpanded, setStatusExpanded] = useState<boolean>(false);

  const [sort, setSort] = useState(() => {
    const search = new URLSearchParams(location.search);
    const initialState = search.get('sort') ? encodeURIComponent(search.get('sort')) : null;
    return initialState;
  });
  
  const [isSortExpanded, setSortExpanded] = useState<boolean>(false);

  const [search, setSearch] = useState(() => {
    const params = new URLSearchParams(location.search);
    let initialState = params.get('q') ? params.get('q') : '';
    initialState = params.get('category') ? `${initialState} category='${params.get('category')}'`.trim() : initialState;
    return initialState;
  });

  const [ category, setCategory] = useState(() => {
    const params = new URLSearchParams(location.search);
    const initialState = params.get('category') ? params.get('category') : '';
    return initialState;
  });

  const [hasFetched, setHasFetched] = useState<boolean>(false);

  
  const { engagementService } = useServiceProviders();
  const { engagementFormConfig } = useEngagementFormConfig(engagementService);

  const feedbackContext = useFeedback();
  const {
    engagements: contextEngagements,
    getEngagements,
  } = useEngagementCollection({ feedbackContext, engagementService });

  useEffect(() => {
    const tchips = new Map(engagementFormConfig?.basic_information.engagement_types?.options.map(t => {
        return [ t.label, t.value];
      }),
    );
    setTypeChips(tchips);

    const rchips = new Map(engagementFormConfig?.basic_information.engagement_regions?.options.map(region => {
      return [ region.label, region.value];
    }),
  );
  setRegionChips(rchips);
  }, [engagementFormConfig]);

  useEffect(() => {
    const pathStatii: EngagementStatus[] = [];

    const pathState = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
    if("past" === pathState) {
      pathStatii.push(EngagementStatus[pathState]);
      pathStatii.push(EngagementStatus["terminating"]);
    } else if("all" !== pathState) {
      pathStatii.push(EngagementStatus[pathState]);
    }
    setStatus(pathStatii);

    const search = new URLSearchParams(location.search);
    const pathRegions = search.get('regions') ? search.get('regions').split(',') : [];
    setRegions(pathRegions);
    setTypes([]);
    setCategory('');
    setSearch('');
    setHasFetched(false);

  },[location.pathname]);

  useEffect(() => {
    if (!hasFetched) {
      let lead = '?';
      let params = '';
      let justSearch = null;

      if(search) {
        justSearch = search.replace(/category='.*?'/, '').trim();

        if(justSearch) {
          params = `${params}${lead}q=${justSearch}`;
          lead = '&';
        }
      }

      if(category) {
        params = `${params}${lead}category=${category}`;
        lead = '&';
      }

      if(regions?.length > 0) {
        params = `${params}${lead}regions=${regions.join(',')}`;
        lead = '&';
      }

      if(types?.length > 0) {
        params = `${params}${lead}types=${types.join(',')}`;
        lead = '&';
      }

      if(statii?.length > 0) {
        params = `${params}${lead}statii=${statii.join(',')}`;
        lead = '&';
      }

      if(sort) {
        params = `${params}${lead}sort=${sort}`;
        lead = '&';
      }

      history.replace(`${location.pathname}${params}`)
      setHasFetched(true);
      getEngagements({ search: justSearch, engagementStatuses: statii, engagementRegions: regions, types: types, sortField: sort, category: category });
    }
  }, [contextEngagements, getEngagements, hasFetched, statii, regions, category, history, search, sort, types, location.pathname]);
  

  function handleRegionToggle() {
    setRegionExpanded(!isRegionExpanded);
  }

  function handleRegionSelection(selected:string) {
    const selectedValue = regionChips.has(selected) ? regionChips.get(selected) : selected;
    if(selected == null) {
      setRegions([]);
    } else if(regions.includes(selectedValue)) {
      setRegions(regions.filter(function(element) {
        return element !== selectedValue;
      }));
    } else {
      setRegions([...regions, selectedValue]);
    }
    setHasFetched(false);
  }

  function handleTypeToggle() {
    setTypeExpanded(!isTypeExpanded);
  }

  function handleTypeSelection(selected:string) {
    const selectedValue = typeChips.has(selected) ? typeChips.get(selected) : selected;
    if(selected == null) {
      setTypes([]);
    } else if(types.includes(selectedValue)) {
      setTypes(types.filter(function(element) {
        return element !== selectedValue;
      }));
    } else {
      setTypes([...types, selectedValue]);
    }
    setHasFetched(false);
  }

  function handleStatusToggle() {
    setStatusExpanded(!isStatusExpanded);
  }

  function handleStatusSelection(selected:string) {
    const selectedEnum = EngagementStatus[selected?.toLowerCase()];
    if(selected == null) { //clear all
      setStatus([]);
    } else if(statii.includes(selectedEnum)) { //clear one
      setStatus(statii.filter(function(element) {
        return element !== selectedEnum;
      }));
    } else { //add
      setStatus([...statii, selectedEnum]);
    }
    setHasFetched(false);
  }

  function handleSortToggle() {
    setSortExpanded(!isSortExpanded);
  }

  function handleSortSelection(selected) {
    setSort(selected);
    setHasFetched(false);
  }

  function handleSearchChange(searchTerm: string) {
    console.log('sarch', `${searchTerm}..`);
    const regex = /category='.*?'/; //Does a valid category match anywhere in the search bar
    const match = searchTerm.match(regex);

    //if category found then extract the input
    const cat = match?.length === 1 ? match[0].split("'")[1] : '';
  
    setCategory(cat);
    setSearch(searchTerm);
    
  }

  function handleCategoryChange(cat: string) {
    setCategory(cat);

    const regex = /category='(.*?)'/; 
    const findMatch = search.match(regex);
    
    const catSearch = cat ? `category='${cat}'` : ''

    findMatch == null
       ? setSearch(`${search} ${catSearch}`)
       : setSearch(search.replace(regex, catSearch))
  }

  function handleSearchGo(searchTerm: string, leCategory: string) {
    setCategory(leCategory);
    setSearch(searchTerm.trim());

    setHasFetched(false);
  }

  function handleClearAll() {
    setTypes([]);
    setRegions([]);
    setStatus([]);
    setHasFetched(false);
  }

  return {
    regions,
    isRegionExpanded,
    handleRegionSelection,
    handleRegionToggle,
    types,
    isTypeExpanded,
    handleTypeSelection,
    handleTypeToggle,
    statii,
    isStatusExpanded,
    handleStatusSelection,
    handleStatusToggle,
    sort,
    isSortExpanded,
    handleSortSelection,
    handleSortToggle,
    search,
    handleSearchChange,
    handleSearchGo,
    category,
    handleCategoryChange,
    handleClearAll,
    engagementFormConfig,
    contextEngagements,
  }
}

export function EngagementListRoute(props: EngagementListRouteProps) {
  const { regions,
    isRegionExpanded,
    handleRegionSelection, 
    handleRegionToggle,
    types,
    isTypeExpanded,
    handleTypeSelection,
    handleTypeToggle,
    statii,
    isStatusExpanded,
    handleStatusSelection,
    handleStatusToggle,
    sort,
    isSortExpanded,
    handleSortSelection,
    handleSortToggle,
    search,
    handleSearchChange,
    handleSearchGo,
    category,
    handleCategoryChange,
    handleClearAll,
    engagementFormConfig,
    contextEngagements, } = useEngagementFilter();

  const history = useHistory();

  const title = props.title ?? 'Engagements';
  const subtitle = props.subtitle ?? '';
  const availableRegions = engagementFormConfig?.basic_information?.engagement_regions?.options ?? []
  const availableTypes = engagementFormConfig?.basic_information.engagement_types?.options ?? [];

  const widths = {
    default: '200px',
    sm: '80px',
    md: '150px',
    lg: '300px',
    xl: '50px',
    '2xl': '600px'
  };

  const regionOptions = availableRegions.map(region => {
    return (
      <SelectOption
        key={region.value}
        data-testid={`engagement_region`}
        value={region.value}
      >
        {region.label}
      </SelectOption>
    );
  });

  const regionChips = availableRegions.filter(region => regions.includes(region.value))
    .flatMap(region => [region.label]);

  const typeOptions = availableTypes.map(type => {
    return (
      <SelectOption
        key={type.value}
        data-testid={`engagement_type`}
        value={type.value}
      >
        {type.label}
      </SelectOption>
    );
  });

  const typeChipsSelected = availableTypes.filter(type => types.includes(type.value))
    .flatMap(type => type.label);

  const statusOptions = Object.keys(EngagementStatus).map(statusKey => {
    return (
      <SelectOption
        key={statusKey}
        value={EngagementStatus[statusKey]}
        data-testid={EngagementStatus[statusKey]}
      >
        {EngagementStatus[statusKey].charAt(0).toUpperCase() + EngagementStatus[statusKey].slice(1)}
      </SelectOption>
    );
  });

  const statusChipsSelected = Object.keys(EngagementStatus).filter(statusKey => statii.includes(EngagementStatus[statusKey]))
    .flatMap(statusKey => EngagementStatus[statusKey].charAt(0).toUpperCase() + EngagementStatus[statusKey].slice(1));

  const sortSelectOptions = Object.keys(EngagementSortFields)
  .reduce<any[]>(
        (options, sortKey) => {
          return [
            ...options,
            <SelectOption key={`${sortKey}%7Cdesc`}
              value={`${sortKey}%7Cdesc`}
              data-testid={`${sortKey}-desc`}>
                <LongArrowAltDownIcon/> {EngagementSortFields[sortKey]}
            </SelectOption>,
            <SelectOption key={`${sortKey}%7Casc`}
            value={`${sortKey}%7Casc`}
            data-testid={`${sortKey}-asc`}>
              <LongArrowAltUpIcon/> {EngagementSortFields[sortKey]}
          </SelectOption>
          ];
        },[]);
    
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
          <FlexItem>
            <TextContent>
              <Text component="h1">{title}</Text>
              <Text component="p">{subtitle}</Text>
            </TextContent>
          </FlexItem>
          <Feature name={'writer'}>
            <FlexItem>
              <Button
                onClick={() => history.push('/app/engagements/new')}
                id={'button_create_new_engagement'}
                data-cy="create-new-engagement"
              >
                Create New Engagement
              </Button>
            </FlexItem>
          </Feature>
        </Flex>
      </PageSection>
      <PageSection>
        <div style={{ margin: '0 1rem' }}>
        <Flex justifyContent={{ default: 'justifyContentFlexStart' }}>
    <Flex
      style={{ marginTop: '2rem' }}
      direction={{ default: 'column', md: 'row' }}
    >
      <FlexItem grow={{ default: 'grow' }}>
        <Toolbar clearAllFilters={() => handleClearAll()}>
          <ToolbarContent>
            <ToolbarItem widths={widths}>
              <AdvancedSearchInput 
                searchValue={search} 
                categoryValue={category} 
                onSearchChange={(search) => handleSearchChange(search)}
                onSearch={(free, cat) => handleSearchGo(free, cat)}
                onCategoryChange={(category) => handleCategoryChange(category)}/>
            </ToolbarItem>
            <ToolbarItem>
            <ToolbarFilter categoryName="status" chips={statusChipsSelected}
                deleteChip={(_event, type) => handleStatusSelection(type as EngagementStatus)}
                deleteChipGroup={() => handleStatusSelection(null)}>
                <Select 
                  aria-label="Status"
                  variant={SelectVariant.checkbox}
                  placeholderText="Status"
                  isOpen={isStatusExpanded}
                  onSelect={(_event, type) => handleStatusSelection(type as EngagementStatus)}
                  onToggle={handleStatusToggle}
                  toggleIcon={<FilterIcon/>}
                  toggleId={'status_dropdown'}
                  selections={[...statii]}>
                  {statusOptions}
                </Select>
              </ToolbarFilter>
            </ToolbarItem>
            <ToolbarItem>
              <ToolbarFilter categoryName="type" chips={typeChipsSelected}
                deleteChip={(_event, type) => handleTypeSelection(type as string)}
                deleteChipGroup={() => handleTypeSelection(null)}>
                <Select 
                  aria-label="Type"
                  variant={SelectVariant.checkbox}
                  placeholderText="Type"
                  isOpen={isTypeExpanded}
                  onSelect={(_event, type) => handleTypeSelection(type as string)}
                  onToggle={handleTypeToggle}
                  toggleIcon={<FilterIcon/>}
                  toggleId={'type_dropdown'}
                  selections={[...types]}>
                  {typeOptions}
                </Select>
              </ToolbarFilter>
            </ToolbarItem>
            <ToolbarItem>
              <ToolbarFilter categoryName="region" chips={regionChips}
                deleteChip={(_event, region) => handleRegionSelection(region as string)}
                deleteChipGroup={() => handleRegionSelection(null)}>
                <Select 
                  aria-label="Region"
                  variant={SelectVariant.checkbox}
                  placeholderText="Region"
                  isOpen={isRegionExpanded}
                  onSelect={(_event, region) => handleRegionSelection(region as string)}
                  onToggle={handleRegionToggle}
                  toggleIcon={<GlobeIcon/>}
                  toggleId={'region_dropdown'}
                  selections={[...regions]}>
                  {regionOptions}
                </Select>
              </ToolbarFilter>
            </ToolbarItem>
            <ToolbarItem>
              <ToolbarFilter categoryName="sort" data-cy="sort-filter">
                <Select
                  aria-label="Sort by"
                  placeholderText="Sort"
                  isOpen={isSortExpanded}
                  onSelect={(_event, sort) => handleSortSelection(sort)}
                  onToggle={handleSortToggle}
                  toggleIcon={<SortAmountDownIcon/>}
                  toggleId={'sort_dropdown'}
                  selections={sort}>
                  {sortSelectOptions}
                </Select>
              </ToolbarFilter>
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </FlexItem>
    </Flex>
    </Flex>
        </div>
      </PageSection>
      <PageSection data-cy={'engagement_cards_section'}>
        <EngagementList engagements={contextEngagements} onCategorySelect={handleSearchGo} />
      </PageSection>
    </>
  );
}
