export default {
  CreateApp: "span[class='bp3-button-text']",
  searchInput: "input[type='text']",
  appEditIcon: ".t--application-edit-link",
  publishButton: ".t--application-publish-btn",
  shareButton: ".t--application-share-btn",
  deployPopupOptionTrigger: ".t--deploy-popup-option-trigger",
  connectToGitBtn: ".t--connect-to-git-btn",
  currentDeployedPreviewBtn: ".t--current-deployed-preview-btn",
  publishCrossButton: "span[icon='small-cross']",
  homePageID: "//div[@id='root']",
  appMoreIcon: ".bp3-popover-wrapper.more .bp3-popover-target",
  duplicateApp: "[data-cy=t--duplicate]",
  forkAppFromMenu: "[data-cy=t--fork-app]",
  exportAppFromMenu: "[data-cy=t--export-app]",
  forkAppWorkspaceButton: ".t--fork-app-to-workspace-button",
  selectAction: "#Base",
  deleteApp: "[data-cy=t--delete]",
  createNewAppButton: ".t--new-button",
  deleteAppConfirm: "[data-cy=t--delete-confirm]",
  homeIcon: ".t--appsmith-logo",
  inputAppName: "input[name=applicationName]",
  createNew: ".createnew",
  createWorkspace: "span:contains('New Workspace')",
  inputWorkspaceName: "//input[@name='name']",
  submitBtn: "//span[text()='Submit']",
  workspaceMenu: "//span[text()='TestShareWorkspace']",
  members: "//span[contains(text(),'Members')]",
  share: "//span[contains(text(),'Share')]",
  WorkspaceSettings: "//span[contains(text(),'Workspace Settings')]",
  MemberSettings: "//span[contains(text(),'Members')]",
  inviteUser: "//span[text()='Invite Users']",
  inviteUserMembersPage: "[data-testid=t--page-header-input]",
  email: "//input[@type='email']",
  selectRole: "//span[text()='Select a role']",
  adminRole: `//div[contains(@class, 'label-container')]//span[1][text()='Administrator']`,
  viewerRole:
    "//div[contains(@class, 'label-container')]//span[1][text()='App Viewer']",
  developerRole:
    "//div[contains(@class, 'label-container')]//span[1][text()='Developer']",
  inviteBtn: "//button//span[text()='Invite']",
  manageUsers: ".manageUsers",
  DeleteBtn: "[data-cy=t--deleteUser]",
  ShareBtn: "//button//span[2][text()='Share']",
  launchBtn: "//span[text()='Launch']",
  appView: ".t--application-view-link",
  applicationCard: ".t--application-card",
  appsContainer: ".t--applications-container",
  appHome: "//a[@href='/applications']",
  emailList: "[data-colindex='0']",
  workspaceList: ".t--workspace-section:contains(",
  workspaceSectionBtn: ".t--workspace-section .bp3-button",
  shareWorkspace: ") button:contains('Share')",
  workspaceSection: "a:contains(",
  createAppFrWorkspace: ") .t--new-button",
  shareApp: ".t--application-share-btn",
  enablePublicAccess: ".t--share-public-toggle .slider",
  closeBtn: ".bp3-dialog-close-button",
  editModeInviteModalCloseBtn: ".t--close-form-dialog",
  applicationName: ".t--application-name",
  applicationEditMenu: ".t--application-edit-menu",
  editingAppName: "bp3-editable-text-editing",
  portalMenuItem: ".bp3-portal .bp3-menu-item",
  profileMenu: ".bp3-popover-wrapper.profile-menu",
  signOutIcon: ".t--logout-icon",
  headerAppSmithLogo: ".t--Appsmith-logo-image",
  applicationCardName: "[data-cy=t--app-card-name]",
  applicationIconSelector: ".t--icon-not-selected",
  applicationColorSelector: ".t--color-not-selected",
  applicationBackgroundColor: ".t--application-card-background",
  workspaceSettingOption: "[data-cy=t--workspace-setting]",
  workspaceImportAppOption: "[data-cy=t--workspace-import-app]",
  workspaceImportAppModal: ".t--import-application-modal",
  workspaceImportAppButton: "[data-cy=t--workspace-import-app-button]",
  leaveWorkspaceConfirmModal: ".t--member-delete-confirmation-modal",
  leaveWorkspaceConfirmButton: "[data-cy=t--workspace-leave-button]",
  workspaceNameInput: "[data-cy=t--workspace-name-input]",
  renameWorkspaceInput: "[data-cy=t--workspace-rename-input]",
  workspaceEmailInput: "[data-cy=t--workspace-email-input]",
  workspaceWebsiteInput: "[data-cy=t--workspace-website-input]",
  workspaceHeaderName: "[data-testid='t--page-title']",
  leftPanelContainer: "[data-cy=t--left-panel]",
  themeText: "label div",
  shareUserIcons: ".workspace-share-user-icons",
  toastMessage: ".t--toast-action",
  uploadLogo: "//div/form/input",
  removeLogo: ".remove-button a span",
  generalTab: "//li//span[text()='General']",
  membersTab: "//li//span[text()='Members']",
  cancelBtn: "//span[text()='Cancel']",
  submit: "button:contains('Submit')",
  workspaceNamePopover: ".t--workspace-name",
  workspaceNamePopoverContent: ".bp3-popover-content",
  workspaceCompleteSection: ".t--workspace-section",
  workspaceNameText: ".t--workspace-name-text",
  optionsIcon: ".t--options-icon",
  reconnectDatasourceModal: ".reconnect-datasource-modal",
  importAppProgressWrapper: ".t-import-app-progress-wrapper",
  backtoHome: ".t--app-viewer-back-to-apps-button",
};
