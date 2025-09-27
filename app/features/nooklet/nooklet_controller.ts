import type { HttpContext } from '@adonisjs/core/http';
import { DateTime } from 'luxon';
import Profile from '#features/user/profile';
import NookletService, {
  NOOKLET_ERRORS,
  type CreateNookletPayload,
  type UpdateNookletPayload,
} from '#features/nooklet/nooklet_service';
import {
  createNookletValidator,
  updateNookletValidator,
} from '#features/nooklet/nooklet_validator';

const PROFILE_ERROR = 'PROFILE_NOT_FOUND' as const;

// Resolve the owning profile from the authenticated user
async function resolveOwnerId(authUserId: string): Promise<string> {
  const profile = await Profile.findBy('auth_user_id', authUserId);
  if (!profile) {
    throw new Error(PROFILE_ERROR);
  }
  return profile.id;
}

function parsePublishedAt(input?: string | null): DateTime | null {
  if (input === undefined || input === null) {
    return null;
  }
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }
  const parsed = DateTime.fromISO(trimmed);
  if (!parsed.isValid) {
    throw new Error('INVALID_PUBLISHED_AT');
  }
  return parsed;
}

export default class NookletController {
  async index({ inertia, auth, response }: HttpContext) {
    const user = auth.user;
    if (!user) {
      return response.redirect('/login');
    }

    try {
      const profileId = await resolveOwnerId(user.id);
      const nooklets = await NookletService.listForUser(profileId);
      const serialized = nooklets.map((entry) => entry.serialize());
      return inertia.render('JournalHome', { nooklets: serialized });
    } catch (error) {
      if ((error as Error).message === PROFILE_ERROR) {
        return inertia.render('JournalHome', { nooklets: [] });
      }
      throw error;
    }
  }

  async store({ request, response, auth }: HttpContext) {
    try {
      const payload = await request.validateUsing(createNookletValidator);
      const user = auth.user;
      if (!user) {
        return response.unauthorized({ message: 'Not authenticated' });
      }

      const profileId = await resolveOwnerId(user.id);

      const createPayload: CreateNookletPayload = {
        profileId,
        type: payload.type,
        content: payload.content,
        rawContent: payload.rawContent ?? null,
        summary: payload.summary ?? null,
        metadata: payload.metadata,
        isDraft: payload.isDraft,
        isFavorite: payload.isFavorite,
      };

      const nooklet = await NookletService.create(createPayload);

      return response.created({ data: nooklet.serialize() });
    } catch (error) {
      if ((error as Error).message === PROFILE_ERROR) {
        return response.badRequest({ message: 'Profile not found' });
      }
      if ((error as Error).message === 'INVALID_PUBLISHED_AT') {
        return response.unprocessableEntity({
          message: 'Invalid publishedAt value',
        });
      }
      throw error;
    }
  }

  async update({ request, response, auth, params }: HttpContext) {
    try {
      const payload = await request.validateUsing(updateNookletValidator);
      const user = auth.user;
      if (!user) {
        return response.unauthorized({ message: 'Not authenticated' });
      }

      const profileId = await resolveOwnerId(user.id);
      const publishedAt =
        payload.publishedAt !== undefined
          ? parsePublishedAt(payload.publishedAt)
          : undefined;

      const updatePayload: UpdateNookletPayload = {
        type: payload.type,
        content: payload.content,
        rawContent: payload.rawContent ?? null,
        summary: payload.summary ?? null,
        metadata: payload.metadata,
        isDraft: payload.isDraft,
        isFavorite: payload.isFavorite,
        publishedAt,
      };

      const nooklet = await NookletService.update(
        params.id,
        profileId,
        updatePayload,
      );
      return response.ok({ data: nooklet.serialize() });
    } catch (error) {
      const message = (error as Error).message;
      if (message === PROFILE_ERROR) {
        return response.badRequest({ message: 'Profile not found' });
      }
      if (message === 'INVALID_PUBLISHED_AT') {
        return response.unprocessableEntity({
          message: 'Invalid publishedAt value',
        });
      }
      if (message === NOOKLET_ERRORS.NOT_FOUND) {
        return response.notFound({ message: 'Nooklet not found' });
      }
      throw error;
    }
  }

  async destroy({ response, auth, params }: HttpContext) {
    try {
      const user = auth.user;
      if (!user) {
        return response.unauthorized({ message: 'Not authenticated' });
      }

      const profileId = await resolveOwnerId(user.id);
      const nooklet = await NookletService.archive(params.id, profileId);
      return response.ok({ data: nooklet.serialize() });
    } catch (error) {
      const message = (error as Error).message;
      if (message === PROFILE_ERROR) {
        return response.badRequest({ message: 'Profile not found' });
      }
      if (message === NOOKLET_ERRORS.NOT_FOUND) {
        return response.notFound({ message: 'Nooklet not found' });
      }
      throw error;
    }
  }
}
