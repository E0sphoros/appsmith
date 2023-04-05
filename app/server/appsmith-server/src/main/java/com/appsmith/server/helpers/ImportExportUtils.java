package com.appsmith.server.helpers;

import static com.appsmith.external.constants.GitConstants.NAME_SEPARATOR;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import com.appsmith.external.interfaces.DeletableResource;
import com.appsmith.external.models.BaseDomain;
import com.appsmith.external.models.Datasource;
import com.appsmith.server.acl.AclPermission;
import com.appsmith.server.constants.ResourceModes;
import com.appsmith.server.constants.SerialiseApplicationObjective;
import com.appsmith.server.domains.ActionCollection;
import com.appsmith.server.domains.Application;
import com.appsmith.server.domains.CustomJSLib;
import com.appsmith.server.domains.NewAction;
import com.appsmith.server.domains.NewPage;
import com.appsmith.server.domains.Plugin;
import com.appsmith.server.dtos.ActionCollectionDTO;
import com.appsmith.server.dtos.PageDTO;
import com.appsmith.server.migrations.JsonSchemaVersions;
import com.appsmith.server.solutions.DomainPermission;

public class ImportExportUtils {

    /**
     * This function checks whether serialisation is for version control
     * 
     * @param serialiseFor objective of serialisation
     * @return true if serialisation is for version control, false otherwise
     */
    public static boolean isGitSync(SerialiseApplicationObjective serialiseFor) {
        return SerialiseApplicationObjective.VERSION_CONTROL.equals(serialiseFor);
    }

    /**
     * This function gets resource access permission for the given objective
     * 
     * @param application      application object
     * @param serialiseFor     objective of serialisation
     * @param domainPermission domain permission object
     */
    public static Optional<AclPermission> getResourceAccessPermissionForObjective(Application application,
            SerialiseApplicationObjective serialiseFor, DomainPermission domainPermission, boolean isImport) {
        if(isImport == true) {
            return Optional.of(domainPermission.getEditPermission());
        }
        if (ImportExportUtils.isGitSync(serialiseFor)) {
            return Optional.empty();
        } 
        if (!isImport && application != null && Optional.ofNullable(application.getExportWithConfiguration()).orElse(false)) {
            return Optional.of(domainPermission.getReadPermission());
        }
        return Optional.of(domainPermission.getEditPermission());
    }

    /**
     * This function checks whether the resource is updated after last commit
     * 
     * @param application application object
     * @param resource    resource object
     * @return true if resource is updated after last commit, false otherwise
     */
    public static boolean isResourceUpdatedAfterLastCommit(Application application, BaseDomain resource) {
        Instant applicationLastCommittedAt = Instant.MIN;

        if (application.getGitApplicationMetadata() != null
                && application.getGitApplicationMetadata().getLastCommittedAt() != null) {
            // If application has git metadata and last committed at is not null then get
            // the actual value
            applicationLastCommittedAt = application.getGitApplicationMetadata().getLastCommittedAt();
        }

        boolean isClientSchemaMigrated = !JsonSchemaVersions.clientVersion.equals(application.getClientSchemaVersion());
        boolean isServerSchemaMigrated = !JsonSchemaVersions.serverVersion.equals(application.getServerSchemaVersion());

        return isClientSchemaMigrated || isServerSchemaMigrated || resource.getUpdatedAt() == null
                || applicationLastCommittedAt.isBefore(resource.getUpdatedAt());
    }

    /**
     * This function returns a set of modified custom JS libs
     * 
     * @param application  application object
     * @param customJSLibs list of custom JS libs
     * @return set of modified custom JS lib uids
     */
    public static Set<String> getUpdatedCustomJSLibsForApplication(Application application,
            List<CustomJSLib> customJSLibs) {
        return customJSLibs
                .stream()
                .filter(lib -> isResourceUpdatedAfterLastCommit(application, lib))
                .map(lib -> lib.getUidString())
                .collect(Collectors.toSet());
    }

    /**
     * This function returns a set of modified pages
     * 
     * @param application application object
     * @param pages       list of pages
     * @return set of modified page uids
     */
    public static Set<String> getUpdatedPagesForApplication(Application application, List<NewPage> pages,
            ResourceModes resourceMode) {
        // TODO make this function generic
        return pages
                .stream()
                .filter(page -> isResourceUpdatedAfterLastCommit(application, page)
                        && page.select(resourceMode).getName() != null)
                .map(page -> page.select(resourceMode).getName())
                .collect(Collectors.toSet());
    }

    /**
     * This function returns a set of modified actions
     * 
     * @param application application object
     * @param actions     list of actions
     * @return set of modified action names
     */
    public static Set<String> getUpdatedActionsForApplication(Application application, List<NewAction> actions,
            ResourceModes resourceMode) {
        return actions
                .stream()
                .filter(action -> isResourceUpdatedAfterLastCommit(application, action))
                .map(action -> action.select(resourceMode).getName() + NAME_SEPARATOR
                        + action.select(resourceMode).getPageId())
                .collect(Collectors.toSet());
    }

    /**
     * This function gets the set of updated collections for a given application
     * 
     * @param application       application object
     * @param actionCollections list of action collections
     * @return set of updated collection names
     */
    public static Set<String> getUpdatedActionCollectionsForApplication(Application application,
            List<ActionCollection> actionCollections, ResourceModes resourceMode) {
        return actionCollections
                .stream()
                .filter(actionCollection -> isResourceUpdatedAfterLastCommit(application, actionCollection))
                .map(actionCollection -> actionCollection.select(resourceMode).getPageId() + NAME_SEPARATOR
                        + actionCollection.select(resourceMode).getName())
                .collect(Collectors.toSet());
    }

    /**
     * This function calculates the map of page id to name
     * 
     * @param pages list of pages
     * @return map of page id to name
     */
    public static Map<String, String> calculatePageIdToNameMap(List<NewPage> pages, ResourceModes resourceMode) {
        return pages.stream()
                .map(page -> {
                    PageDTO pageDTO = page.select(resourceMode);
                    pageDTO.setId(page.getId());
                    return pageDTO;
                })
                .collect(Collectors.toMap(PageDTO::getId, PageDTO::getName));
    }

    /**
     * This function calculates the map of plugin id to name
     * 
     * @param plugins list of plugins
     * @return map of plugin id to name
     */
    public static Map<String, String> calculatePluginIdToNameMap(List<Plugin> plugins) {
        return plugins.stream()
                .collect(Collectors.toMap(BaseDomain::getId, ImportExportUtils::getPluginName));
    }

    /**
     * This function calculates the map of datasource id to name
     * 
     * @param datasource list of datasources
     * @return map of datasource id to name
     */
    public static Map<String, String> calculateDatasourceIdToNameMap(List<Datasource> datasource) {
        return datasource.stream()
                .collect(Collectors.toMap(Datasource::getId, Datasource::getName));
    }

    /**
     * This function calculates the map of action collection id to name
     * 
     * @param actionCollections list of action collections
     * @return map of action collection id to name
     */
    public static Map<String, String> calculateActionCollectionIdToNameMap(List<ActionCollection> actionCollections,
            ResourceModes resourceMode) {
        return actionCollections.stream()
                .map(actionCollection -> {
                    ActionCollectionDTO actionCollectionDTO = actionCollection.select(resourceMode);
                    actionCollectionDTO.setId(actionCollection.getId());
                    return actionCollectionDTO;
                })
                .collect(Collectors.toMap(ActionCollectionDTO::getId, ActionCollectionDTO::getName));
    }

    /**
     * This utility function returns the plugin name if present, else returns the
     * package name
     * TODO find out why this is needed, can we update plugin name using migration?
     * 
     * @param plugin plugin object
     * @return plugin name
     */
    public static String getPluginName(Plugin plugin) {
        return Optional.ofNullable(plugin.getPluginName()).orElse(plugin.getPackageName());
    }

    public static boolean isResourceDeleted(DeletableResource resource) {
        return resource == null || resource.getDeletedAt() != null;
    }

    public static Map<String, String> calculatePluginNameToPluginIdMap(List<Plugin> plugins) {
        return plugins.stream()
                .collect(Collectors.toMap(ImportExportUtils::getPluginName, BaseDomain::getId));
    }

    public static Map<String, String> calculatePageNameToPageIdMap(List<NewPage> pages, ResourceModes resourceMode) {
        return pages.stream()
                .map(page -> {
                    PageDTO pageDTO = page.select(resourceMode);
                    pageDTO.setId(page.getId());
                    return pageDTO;
                })
                .collect(Collectors.toMap(PageDTO::getName, PageDTO::getId));
    }
}