import { defineField, defineType } from 'sanity'

export const hero = defineType({
  name: 'hero',
  title: 'Hero Section',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Main headline (e.g., "Build Products")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headingHighlight',
      title: 'Heading Highlight',
      type: 'string',
      description: 'Second line of headline with muted color (e.g., "That Inspire")',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 3,
      description: 'Supporting text below the headline',
    }),
    defineField({
      name: 'badgeText',
      title: 'Badge Text',
      type: 'string',
      description: 'Text shown in the badge above headline (e.g., "Now accepting new projects")',
    }),
    defineField({
      name: 'ctaPrimary',
      title: 'Primary CTA Text',
      type: 'string',
      description: 'Text for the primary button (e.g., "Work with me")',
    }),
    defineField({
      name: 'ctaPrimaryLink',
      title: 'Primary CTA Link',
      type: 'string',
      description: 'Link for the primary button (e.g., "#footer" or "/contact")',
    }),
    defineField({
      name: 'ctaSecondary',
      title: 'Secondary CTA Text',
      type: 'string',
      description: 'Text for the secondary button (e.g., "View Projects")',
    }),
    defineField({
      name: 'ctaSecondaryLink',
      title: 'Secondary CTA Link',
      type: 'string',
      description: 'Link for the secondary button (e.g., "/works")',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'badgeText',
    },
  },
})
