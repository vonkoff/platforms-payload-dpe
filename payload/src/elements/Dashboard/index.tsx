import { type groupNavItems } from "@payloadcms/ui/shared";
import { AdminViewProps, ServerProps } from "payload";
import { FC, Fragment } from "react";
import { DashboardBanner } from "./DashboardBanner";
import { DashboardGroup } from "./DashboardGroup";
import { MissingPostsGroup } from "./MissingPostsGroup";

type DashboardProps = {
  navGroups: ReturnType<typeof groupNavItems>;
} & AdminViewProps &
  ServerProps;

export const Dashboard: FC<DashboardProps> = (props) => {
  const {
    navGroups,
    payload,
    payload: {
      config: {
        routes: { admin: adminRoute },
      },
    },
  } = props;

  return (
    <Fragment>
      <DashboardBanner />
      <div className="dashboard">
        <div className="dashboard__wrap">
          <MissingPostsGroup adminRoute={adminRoute} payload={payload} />
          {navGroups.map(({ label, entities }, entityIndex) => (
            <DashboardGroup
              key={entityIndex}
              label={label}
              entities={entities}
              adminRoute={adminRoute}
              payload={payload}
            />
          ))}
        </div>
      </div>
    </Fragment>
  );
};
