import { TIMEZONES } from '../common/timezones';

export abstract class Timezone {
  static get timezones() {
    return TIMEZONES;
  }
  static getLabelFromCode(code: string): string {
    return TIMEZONES.find(t => t.tzCode === code)?.label;
  }
  static getCodeFromLabel(label: string): string {
    return TIMEZONES.find(t => t.label === label)?.tzCode;
  }
}
