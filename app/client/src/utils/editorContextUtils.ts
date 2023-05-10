import type { Plugin } from "api/PluginApi";
import { PluginPackageName } from "entities/Action";
import type { Datasource } from "entities/Datasource";
import { AuthenticationStatus, AuthType } from "entities/Datasource";
import get from "lodash/get";
export function isCurrentFocusOnInput() {
  return (
    ["input", "textarea"].indexOf(
      document.activeElement?.tagName?.toLowerCase() || "",
    ) >= 0
  );
}

/**
 * This method returns boolean if the propertyControl is focused.
 * @param domElement
 * @returns
 */
export function shouldFocusOnPropertyControl(
  domElement?: HTMLDivElement | null,
) {
  let isCurrentFocusOnProperty = false;

  if (domElement) {
    isCurrentFocusOnProperty = domElement.contains(document.activeElement);
  }

  return !(isCurrentFocusOnInput() || isCurrentFocusOnProperty);
}

/**
 * Returns a focusable field of PropertyControl.
 * @param element
 * @returns
 */
export function getPropertyControlFocusElement(
  element: HTMLDivElement | null,
): HTMLElement | undefined {
  if (element?.children) {
    const [, propertyInputElement] = element.children;

    if (propertyInputElement) {
      const uiInputElement = propertyInputElement.querySelector(
        'button:not([tabindex="-1"]), input, [tabindex]:not([tabindex="-1"])',
      ) as HTMLElement | undefined;
      if (uiInputElement) {
        return uiInputElement;
      }
      const codeEditorInputElement =
        propertyInputElement.getElementsByClassName("CodeEditorTarget")[0] as
          | HTMLElement
          | undefined;
      if (codeEditorInputElement) {
        return codeEditorInputElement;
      }

      const lazyCodeEditorInputElement =
        propertyInputElement.getElementsByClassName("LazyCodeEditor")[0] as
          | HTMLElement
          | undefined;
      if (lazyCodeEditorInputElement) {
        return lazyCodeEditorInputElement;
      }
    }
  }
}

/**
 * Returns true if :
 * - authentication type is not oauth2 or is not a Google Sheet Plugin
 * - authentication type is oauth2 and authorized status success and is a Google Sheet Plugin
 * @param datasource Datasource
 * @param plugin Plugin
 * @returns boolean
 */
export function isDatasourceAuthorizedForQueryCreation(
  datasource: Datasource,
  plugin: Plugin,
): boolean {
  if (!datasource) return false;
  const authType =
    datasource &&
    datasource?.datasourceConfiguration?.authentication?.authenticationType;

  /* 
    TODO: This flag will be removed once the multiple environment is merged to avoid design inconsistency between different datasources.
    Search for: GoogleSheetPluginFlag to check for all the google sheet conditional logic throughout the code.
  */
  const isGoogleSheetPlugin =
    plugin.packageName === PluginPackageName.GOOGLE_SHEETS;
  if (isGoogleSheetPlugin && authType === AuthType.OAUTH2) {
    const isAuthorized =
      datasource?.datasourceConfiguration?.authentication
        ?.authenticationStatus === AuthenticationStatus.SUCCESS;
    return isAuthorized;
  }

  return true;
}

/**
 * Returns datasource property value from datasource?.datasourceConfiguration?.properties
 * @param datasource Datasource
 * @param propertyKey string
 * @returns string | null
 */
export function getDatasourcePropertyValue(
  datasource: Datasource,
  propertyKey: string,
): string | null {
  if (!datasource) {
    return null;
  }

  const properties = datasource?.datasourceConfiguration?.properties;
  if (!!properties && properties.length > 0) {
    const propertyObj = properties.find((prop) => prop.key === propertyKey);
    if (!!propertyObj) {
      return propertyObj.value;
    }
  }

  return null;
}

/**
 * Returns datasource scope value from datasource?.datasourceConfiguration?.authentication?.scopeString
 * @param formData Datasource
 * @param formConfig any
 * @returns string | undefined
 */
export function getDatasourceScopeValue(formData: Datasource, formConfig: any) {
  const configProperty = "datasourceConfiguration.authentication.scopeString";
  const scopeValue = get(formData, configProperty);
  const options = formConfig?.children?.find(
    (child: any) => child?.configProperty === configProperty,
  )?.options;
  const label = options?.find(
    (option: any) => option.value === scopeValue,
  )?.label;
  return label;
}
