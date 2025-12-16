import { Theme } from 'src/app/core/services/theme.service';

export interface RequestContext {
  state?: {
    [key: string]: any;
    authUser?: { userId: string; isAuthenticated: boolean; token?: string | null } | null;
    theme?: Theme;
  };
}
