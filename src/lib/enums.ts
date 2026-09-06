import type { components } from '../api/schema';

/**
 * Enum value -> i18n key.
 *
 * One place, so the card, the filter panel and the SEO landing pages all call
 * a grade the same thing. Keys are built from the enum value itself, which
 * means a value added to openapi.yaml shows up as a missing translation
 * instead of silently rendering as OS_9.
 */

type Grade = components['schemas']['Grade'];
type SubjectArea = components['schemas']['SubjectArea'];
type ExamPrep = components['schemas']['ExamPrep'];
type ProductType = components['schemas']['ProductType'];

export const gradeKey = (grade: Grade) => `enums.grade.${grade}`;
export const areaKey = (area: SubjectArea) => `enums.area.${area}`;
export const examPrepKey = (examPrep: ExamPrep) => `enums.examPrep.${examPrep}`;
export const productTypeKey = (type: ProductType) => `enums.productType.${type}`;
