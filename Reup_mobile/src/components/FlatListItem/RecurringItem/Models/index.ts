export interface RecurringTaskItem {
  id: string;
  title: string;
  status: string;
  category: string;
  priority: string;
  description: string;
  interval_to_perform: string;
  months_of_year: string;
}

export interface RecurringDetailTaskItem {
  key: string;
  title: string;
  value: string;
}
