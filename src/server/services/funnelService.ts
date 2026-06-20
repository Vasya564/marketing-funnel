import { DIRECT_SOURCE, FunnelEvent } from '@/lib/events';
import { UtmParams } from '@/lib/utm';
import { eventRepository } from '../repositories/eventRepository';
import { userRepository } from '../repositories/userRepository';
import { visitRepository } from '../repositories/visitRepository';
import { visitorRepository } from '../repositories/visitorRepository';

const DIRECT_UTM: UtmParams = {
  source: DIRECT_SOURCE,
  medium: null,
  campaign: null,
};

async function firstTouchOf(visitId: string): Promise<UtmParams> {
  const visit = await visitRepository.getById(visitId);

  if (!visit) {
    return DIRECT_UTM;
  }

  return {
    source: visit.source,
    medium: visit.utmMedium,
    campaign: visit.utmCampaign,
  };
}

export const funnelService = {
  async recordEvent(input: {
    visitorId: string;
    existingVisitId: string | null;
    userId: string | null;
    type: FunnelEvent;
    utm: UtmParams;
  }): Promise<{ visitId: string }> {
    await visitorRepository.ensure(input.visitorId);

    const visitId =
      input.existingVisitId ??
      (await visitRepository.start({
        visitorId: input.visitorId,
        userId: input.userId,
        utm: input.utm,
      }));

    await eventRepository.record({
      visitId,
      visitorId: input.visitorId,
      userId: input.userId,
      type: input.type,
    });

    return { visitId };
  },

  async captureEmail(input: {
    email: string;
    visitorId: string;
    visitId: string | null;
  }): Promise<{ userId: string; returning: boolean; visitId: string }> {
    await visitorRepository.ensure(input.visitorId);

    const visitId =
      input.visitId ??
      (await visitRepository.start({
        visitorId: input.visitorId,
        userId: null,
        utm: DIRECT_UTM,
      }));

    const existingUser = await userRepository.findByEmail(input.email);
    const userId =
      existingUser?.id ??
      (await userRepository.create({
        email: input.email,
        utm: await firstTouchOf(visitId),
      }));

    await visitRepository.attachVisitorToUser(input.visitorId, userId);
    await eventRepository.attachVisitorToUser(input.visitorId, userId);
    await eventRepository.record({
      visitId,
      visitorId: input.visitorId,
      userId,
      type: FunnelEvent.EmailSubmitted,
    });

    return { userId, returning: Boolean(existingUser), visitId };
  },

  async hasPurchased(userId: string): Promise<boolean> {
    return eventRepository.hasPurchased(userId);
  },
};
