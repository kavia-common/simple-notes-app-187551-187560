import { useCallback, useEffect, useMemo, useState } from 'react';
import NotesApi from '../api/client';

// PUBLIC_INTERFACE
export function useNotesList(params = {}) {
  /**
   * Hook to load the list of notes with loading/error states and a reload method.
   * Accepts params: { q, sort, order }
   */
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (overrideParams) => {
    const effective = { ...params, ...(overrideParams || {}) };
    setLoading(true);
    setError('');
    try {
      const res = await NotesApi.list(effective);
      setData(Array.isArray(res) ? res : (res?.data ?? []));
    } catch (e) {
      setError(e?.message || 'Failed to load notes.');
    } finally {
      setLoading(false);
    }
  }, [params?.q, params?.sort, params?.order]); // reload when inputs change

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, reload: load, setData };
}

// PUBLIC_INTERFACE
export function useNoteDetail(id) {
  /**
   * Hook to load a single note by id, exposes save and delete actions.
   */
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState('');
  const isNew = useMemo(() => !id, [id]);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const res = await NotesApi.get(id);
      setNote(res);
    } catch (e) {
      setError(e?.message || 'Failed to load note.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const save = useCallback(async (payload) => {
    setError('');
    try {
      if (isNew) {
        const created = await NotesApi.create(payload);
        setNote(created);
        return created;
      } else {
        const updated = await NotesApi.update(id, payload);
        setNote(updated);
        return updated;
      }
    } catch (e) {
      setError(e?.message || 'Failed to save note.');
      throw e;
    }
  }, [id, isNew]);

  const remove = useCallback(async () => {
    setError('');
    try {
      await NotesApi.remove(id);
      return true;
    } catch (e) {
      setError(e?.message || 'Failed to delete note.');
      throw e;
    }
  }, [id]);

  return { note, setNote, loading, error, isNew, reload: load, save, remove };
}
