package com.appsmith.external.models;

import com.appsmith.external.views.Views;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.util.CollectionUtils;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import static com.appsmith.external.helpers.AppsmithBeanUtils.copyNestedNonNullProperties;

@Getter
@Setter
@ToString
@NoArgsConstructor
@Document
public class Datasource extends BranchAwareDomain implements Forkable {

    @Transient
    public static final String DEFAULT_NAME_PREFIX = "Untitled Datasource";

    @JsonView(Views.Public.class)
    String name;

    @JsonView(Views.Public.class)
    String pluginId;

    // name of the plugin. used to log analytics events where pluginName is a required attribute
    // It'll be null if not set
    @Transient
    @JsonView(Views.Public.class)
    String pluginName;

    //Organizations migrated to workspaces, kept the field as deprecated to support the old migration
    @Deprecated
    @JsonView(Views.Public.class)
    String organizationId;

    @JsonView(Views.Public.class)
    String workspaceId;

    @JsonView(Views.Public.class)
    String templateName;

    @JsonView(Views.Public.class)
    DatasourceConfiguration datasourceConfiguration;

    // TODO: make export import false for this one
    @Transient
    @JsonView(Views.Internal.class)
    DatasourceStorage datasourceStorage;


    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @JsonView(Views.Public.class)
    Set<String> invalids;

    /*
     * - To return useful hints to the user.
     * - These messages are generated by the API server based on the other datasource attributes.
     */
    @Transient
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @JsonView(Views.Public.class)
    Set<String> messages = new HashSet<>();

    /*
     * This field is used to determine if the Datasource has been generated by the client or auto-generated by the system.
     * We use this field because when embedded datasources are null, spring-data auditable interfaces throw exceptions
     * while trying set createdAt and updatedAt properties on the null object
     */
    @Transient
    @JsonView(Views.Internal.class)
    Boolean isAutoGenerated = false;

    /*
     * This field is introduced as part of git sync feature, for the git import we will need to identify the datasource's
     * which are not configured. This way user can configure those datasource, which may have been introduced as part of git import.
     */
    @JsonView(Views.Public.class)
    Boolean isConfigured;

    @Transient
    @JsonView(Views.Public.class)
    Boolean isRecentlyCreated;

    /*
     * This field is meant to indicate whether the datasource is part of a template, or a copy of the same.
     * The field is not used anywhere in the codebase because templates are created directly in the DB, and the field
     * serves only as a DTO property.
     */
    @JsonView(Views.Public.class)
    Boolean isTemplate;

    /*
     * This field is meant to indicate whether the datasource is part of a mock DB, or a copy of the same.
     * The field is set during the creation of the mock db
     */
    @JsonView(Views.Public.class)
    Boolean isMock;

    /**
     * This method is here so that the JSON version of this class' instances have a `isValid` field, for backwards
     * compatibility. It may be removed, when sure that no API received is relying on this field.
     *
     * @return boolean, indicating whether this datasource is valid or not.
     */
    @JsonView(Views.Public.class)
    public boolean getIsValid() {
        if (getDatasourceStorage() == null) {
            return CollectionUtils.isEmpty(invalids);
        }
        return getDatasourceStorage().getIsValid();
    }

    /**
     * Intended to function like `.equals`, but only semantically significant fields, except for the ID. Semantically
     * significant just means that if two datasource have same values for these fields, actions against them will behave
     * exactly the same.
     *
     * @return true if equal, false otherwise.
     */
    public boolean softEquals(Datasource other) {
        if (other == null) {
            return false;
        }

        return new EqualsBuilder()
                .append(name, other.name)
                .append(pluginId, other.pluginId)
                .append(isAutoGenerated, other.isAutoGenerated)
                .append(datasourceConfiguration, other.datasourceConfiguration)
                .isEquals();
    }

    /**
     * This method defines the behaviour of a datasource when the application is forked from one workspace to another.
     * It creates a new object from the source datasource object
     * Removes the id and updated at from the object
     * Based on forkWithConfiguration field present in the source app, it sets the authentication for the datasource
     * Returns the new datasource object
     */
    @Override
    public Datasource fork(Boolean forkWithConfiguration, String toWorkspaceId) {
        Datasource newDs = new Datasource();
        copyNestedNonNullProperties(this, newDs);
        newDs.makePristine();
        newDs.setWorkspaceId(toWorkspaceId);
        AuthenticationDTO initialAuth = null;
        if (newDs.getDatasourceConfiguration() != null) {
            initialAuth = newDs.getDatasourceConfiguration().getAuthentication();
        }

        if (!Boolean.TRUE.equals(forkWithConfiguration)) {
            DatasourceConfiguration dsConfig = new DatasourceConfiguration();
            dsConfig.setAuthentication(null);
            if (newDs.getDatasourceConfiguration() != null) {
                dsConfig.setConnection(newDs.getDatasourceConfiguration().getConnection());
            }
            newDs.setDatasourceConfiguration(dsConfig);
        }

        /*
         updating the datasource "isConfigured" field, which will be used to return if the forking is a partialImport or not
         post forking any application, datasource reconnection modal will appear based on isConfigured property
         Ref: getApplicationImportDTO()
         */

        boolean isConfigured = (newDs.getDatasourceConfiguration() != null
                && newDs.getDatasourceConfiguration().getAuthentication() != null);

        if (initialAuth instanceof OAuth2) {
            /*
             This is the case for OAuth2 datasources, for example Google sheets, we don't want to copy the token to the
             new workspace as it is user's personal token. Hence, in case of forking to a new workspace the datasource
             needs to be re-authorised.
             */
            newDs.setIsConfigured(false);
            if (isConfigured) {
                newDs.getDatasourceConfiguration().getAuthentication().setAuthenticationResponse(null);
            }
        } else {
            newDs.setIsConfigured(isConfigured);
        }

        return newDs;
    }

    public Set<String> getInvalids() {
        if (getDatasourceStorage() == null) {
            return this.invalids;
        }
        return getDatasourceStorage().getInvalids();
    }

    public Set<String> getMessages() {
        if (getDatasourceStorage() == null) {
            return this.messages;
        }
        return getDatasourceStorage().getMessages();
    }

    public DatasourceConfiguration getDatasourceConfiguration() {
        if (getDatasourceStorage() == null) {
            return this.datasourceConfiguration;
        }

        return getDatasourceStorage().getDatasourceConfiguration();
    }

    public void sanitiseToExportResource(Map<String, String> pluginMap) {
        this.setPolicies(null);
        this.setUpdatedAt(null);
        this.setCreatedAt(null);
        this.setUserPermissions(null);
        this.setIsConfigured(null);
        this.setInvalids(null);
        this.setId(null);
        this.setWorkspaceId(null);
        this.setOrganizationId(null);
        this.setPluginId(pluginMap.get(this.getPluginId()));
    }

}
