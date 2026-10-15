import { z } from "zod";

// These identifiers are passed to Adapt2 as URL query parameters.
const identifier = z
  .string()
  .trim()
  .min(1, "Enter an identifier.")
  .max(100)
  .regex(
    /^[A-Za-z0-9][A-Za-z0-9._-]*$/,
    "Use letters, numbers, dots, hyphens or underscores."
  );

export const groupSchema = identifier;
export const studentIdSchema = identifier;

export const updateStudentSchema = z.object({
  userId: z.string().min(1),
  group: groupSchema,
  protusId: studentIdSchema,
});

export const selectedGroupSchema = z.object({
  group: groupSchema,
  students: z
    .array(
      z.object({
        id: z.string().min(1),
        previousGroup: z.string().nullable(),
      })
    )
    .min(1, "Select at least one student.")
    .max(1000)
    .refine(
      (students) => new Set(students.map((s) => s.id)).size === students.length,
      "Each student must appear only once."
    ),
});
