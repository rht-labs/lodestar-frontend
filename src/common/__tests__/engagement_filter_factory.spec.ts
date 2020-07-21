import {
  engagementFilterFactory,
  engagementSortFactory,
} from '../engagement_filter_factory';
import {
  EngagementFilter,
  EngagementSortFields,
} from '../../schemas/engagement_filter';
import { Engagement, EngagementStatus } from '../../schemas/engagement_schema';

function mockEngagements(): Engagement[] {
  const engagementA = ({
    customer_name: 'A',
    start_date: new Date(2010, 1, 1),
    end_date: new Date(2010, 2, 2),
    project_name: 'Z',
  } as any) as Engagement;
  const engagementB = ({
    customer_name: 'B',
    start_date: new Date(2010, 1, 1),
    end_date: new Date(2030, 2, 2),
    project_name: 'Y',
    launch: {
      launched_by: 'No one',
      launched_date_time: new Date(2010, 2, 2),
    },
  } as any) as Engagement;
  const engagementC = ({
    customer_name: 'C',
    start_date: new Date(2000, 1, 1),
    end_date: new Date(2000, 2, 2),
    project_name: 'X',
    launch: {
      launched_by: 'No one',
      launched_date_time: new Date(2010, 2, 2),
    },
  } as any) as Engagement;
  const engagementD = ({
    customer_name: 'D',
    start_date: new Date(2011, 1, 1),
    end_date: new Date(2011, 2, 2),
    project_name: 'W',
  } as any) as Engagement;
  return [engagementA, engagementB, engagementC, engagementD];
}

describe('Engagement Filter Factory', () => {
  let engagementA: Engagement;
  let engagementB: Engagement;
  let engagementC: Engagement;
  let engagementD: Engagement;

  let engagements: Engagement[];
  beforeEach(() => {
    const [a, b, c, d] = mockEngagements();
    engagementA = a;
    engagementB = b;
    engagementC = c;
    engagementD = d;
    engagements = [a, b, c, d];
  });
  test('active engagement filter should only allow active engagements', () => {
    let filter: EngagementFilter = {
      allowedStatuses: [EngagementStatus.active],
    };
    let filterFunction = engagementFilterFactory(filter);
    expect(engagements.filter(filterFunction)[0]).toEqual(engagementB);
  });
  test('past engagement filter should only allow past engagements', () => {
    let filter: EngagementFilter = {
      allowedStatuses: [EngagementStatus.past],
    };
    let filterFunction = engagementFilterFactory(filter);
    expect(engagements.filter(filterFunction)[0]).toEqual(engagementC);
  });
  test('upcoming engagement filter should only allow upcoming engagements', () => {
    let filter: EngagementFilter = {
      allowedStatuses: [EngagementStatus.upcoming],
    };
    let filterFunction = engagementFilterFactory(filter);
    const [a, d] = engagements.filter(filterFunction);
    expect([a, d]).toEqual([engagementA, engagementD]);
  });
  test('search term engagement filter should only allow matching engagements, regardless of white space', () => {
    let filter: EngagementFilter = {
      searchTerm: '   a   ',
    };
    let filterFunction = engagementFilterFactory(filter);
    const [a] = engagements.filter(filterFunction);
    expect(a).toEqual(engagementA);
  });
});

describe('Engagement Sort Factory', () => {
  let engagementA: Engagement;
  let engagementB: Engagement;
  let engagementC: Engagement;
  let engagementD: Engagement;
  let engagements: Engagement[];
  let filterDefinition: EngagementFilter;
  beforeEach(() => {
    const [a, b, c, d] = mockEngagements();
    engagementA = a;
    engagementB = b;
    engagementC = c;
    engagementD = d;
    engagements = [a, b, c, d];
  });
  test('sorts by customer ascending', () => {
    filterDefinition = {
      sort: {
        sortField: EngagementSortFields.customerName,
        isAscending: true,
      },
    };
    const sortFunction = engagementSortFactory(filterDefinition);

    expect(engagements.sort(sortFunction)[0]).toEqual(engagementA);
  });
  test('sorts by start date ascending', () => {
    filterDefinition = {
      sort: {
        sortField: EngagementSortFields.startDate,
        isAscending: true,
      },
    };
    const sortFunction = engagementSortFactory(filterDefinition);

    expect(engagements.sort(sortFunction)[0]).toEqual(engagementC);
  });
  test('sorts by end date ascending', () => {
    filterDefinition = {
      sort: {
        sortField: EngagementSortFields.endDate,
        isAscending: true,
      },
    };
    const sortFunction = engagementSortFactory(filterDefinition);

    expect(engagements.sort(sortFunction)[0]).toEqual(engagementC);
  });
  test('sorts by project name ascending', () => {
    filterDefinition = {
      sort: {
        sortField: EngagementSortFields.projectName,
        isAscending: true,
      },
    };
    const sortFunction = engagementSortFactory(filterDefinition);

    expect(engagements.sort(sortFunction)[0]).toEqual(engagementD);
  });
  test('sorts by customer descending', () => {
    filterDefinition = {
      sort: {
        sortField: EngagementSortFields.customerName,
        isAscending: false,
      },
    };
    const sortFunction = engagementSortFactory(filterDefinition);

    expect(engagements.sort(sortFunction)[0]).toEqual(engagementD);
  });
  test('sorts by start date descending', () => {
    filterDefinition = {
      sort: {
        sortField: EngagementSortFields.startDate,
        isAscending: false,
      },
    };
    const sortFunction = engagementSortFactory(filterDefinition);

    expect(engagements.sort(sortFunction)[0]).toEqual(engagementD);
  });
  test('sorts by end date descending', () => {
    filterDefinition = {
      sort: {
        sortField: EngagementSortFields.endDate,
        isAscending: false,
      },
    };
    const sortFunction = engagementSortFactory(filterDefinition);

    expect(engagements.sort(sortFunction)[0]).toEqual(engagementB);
  });
  test('sorts by project name descending', () => {
    filterDefinition = {
      sort: {
        sortField: EngagementSortFields.projectName,
        isAscending: false,
      },
    };
    const sortFunction = engagementSortFactory(filterDefinition);

    expect(engagements.sort(sortFunction)[0]).toEqual(engagementA);
  });
});
