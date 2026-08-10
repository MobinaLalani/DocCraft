import {
  fetchOpenApiAction,
  importDocsAction,
} from "@/app/actions/swagger-import";
import type { DocPage } from "@/lib/docs/schema";
import type { MenuGroup } from "@/lib/docs/workspace";
import type { OpenApiSpec } from "../model";


export async function fetchSwaggerSpec(
  url:string
  
){

  return await fetchOpenApiAction(url);

}



export async function saveSwaggerImport(
  spec: OpenApiSpec,
  controllers: DocPage[],
  groups: MenuGroup[],
) {
  return await importDocsAction(groups, controllers);
}
