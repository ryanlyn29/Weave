'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/api-client';
import { api, ApiError } from '@/lib/api-client';
import { Modal } from '@/components/ui/Modal';

interface EditProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
}

export function EditProfileModal({ user, isOpen, onClose, onSave }: EditProfileModalProps) {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [voiceEnabled, setVoiceEnabled] = useState(user.voiceEnabled);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(user.name);
      setAvatar(user.avatar || '');
      setVoiceEnabled(user.voiceEnabled);
      setError(null);
    }
  }, [isOpen, user]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const updated = await api.updateUser(user.id, {
        name: name.trim(),
        avatar: avatar.trim() || undefined,
        voiceEnabled,
      });

      onSave(updated);
      onClose();
    } catch (err) {
      console.error('Error updating profile:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <div className="space-y-4">
        {error && (
          <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Avatar URL (optional)
          </label>
          <input
            type="url"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="voiceEnabled"
            checked={voiceEnabled}
            onChange={(e) => setVoiceEnabled(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="voiceEnabled" className="text-sm text-gray-700">
            Enable voice features
          </label>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-2xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
