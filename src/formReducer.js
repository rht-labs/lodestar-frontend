const formReducer = (state, action) => {
  switch (action.type) {
    case "customer_name":
      return { ...state, customer_name: action.payload };
    case "project_name":
      return { ...state, project_name: action.payload };
    case "description":
      return { ...state, description: action.payload };
    case "location":
      return { ...state, location: action.payload };
    case "start_date":
      return { ...state, start_date: action.payload };
    case "end_date":
      return { ...state, end_date: action.payload };
    case "archive_date":
      return { ...state, archive_date: action.payload };
    case "engagement_lead_name":
      return { ...state, engagement_lead_name: action.payload };
    case "engagement_lead_email":
      return { ...state, engagement_lead_email: action.payload };
    case "technical_lead_name":
      return { ...state, technical_lead_name: action.payload };
    case "technical_lead_email":
      return { ...state, technical_lead_email: action.payload };
    case "customer_contact_name":
      return { ...state, customer_contact_name: action.payload };
    case "customer_contact_email":
      return { ...state, customer_contact_email: action.payload };
    case "ocp_cloud_provider_name":
      return { ...state, ocp_cloud_provider_name: action.payload };
    case "ocp_cloud_provider_region":
      return { ...state, ocp_cloud_provider_region: action.payload };
    case "ocp_version":
      return { ...state, ocp_version: action.payload };
    case "ocp_sub_domain":
      return { ...state, ocp_sub_domain: action.payload };
    case "ocp_persistent_storage_size":
      return { ...state, ocp_persistent_storage_size: action.payload };
    case "ocp_cluster_size":
      return { ...state, ocp_cluster_size: action.payload };
    default:
      throw new Error();
  }
};

export default formReducer;
