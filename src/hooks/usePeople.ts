"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPerson,
  deletePerson,
  getAllPeople,
  updatePerson,
  type PersonDraft,
} from "@/services/peopleService";
import { queryKeys } from "@/services/queryKeys";
import type { Person } from "@/types";

export const usePeople = () =>
  useQuery({
    queryKey: queryKeys.people,
    queryFn: getAllPeople,
  });

export const useCreatePerson = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (draft: PersonDraft) => createPerson(draft),
    onSuccess: (person) => {
      client.setQueryData<Person[]>(queryKeys.people, (prev = []) => [...prev, person]);
    },
  });
};

export const useUpdatePerson = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Person> }) =>
      updatePerson(id, patch),
    onMutate: async ({ id, patch }) => {
      await client.cancelQueries({ queryKey: queryKeys.people });
      const previous = client.getQueryData<Person[]>(queryKeys.people);
      client.setQueryData<Person[]>(queryKeys.people, (prev = []) =>
        prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) client.setQueryData(queryKeys.people, context.previous);
    },
    onSettled: () => {
      client.invalidateQueries({ queryKey: queryKeys.people });
    },
  });
};

export const useDeletePerson = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePerson(id),
    onSuccess: (_data, id) => {
      client.setQueryData<Person[]>(queryKeys.people, (prev = []) =>
        prev.filter((p) => p.id !== id)
      );
      client.invalidateQueries({ queryKey: queryKeys.transactions });
    },
  });
};
