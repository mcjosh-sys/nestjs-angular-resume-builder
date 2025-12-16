import { inject } from '@angular/core';
import { PremiumModalEvents } from '@shared/components/premium-modal/premium-modal.component';
import { EventBusService } from '../services/refresh/event-bus.service';

export const premiumModal = () => {
  const eventBust = inject(EventBusService<PremiumModalEvents>);

  return {
    open: () => eventBust.emit('state', 'open'),
    close: () => eventBust.emit('state', 'closed'),
  };
};
