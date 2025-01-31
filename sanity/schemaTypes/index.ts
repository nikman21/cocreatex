import { type SchemaTypeDefinition } from 'sanity'
import { author } from './author'
import { project } from './project'
import { application } from './application'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, project, application ],
}
