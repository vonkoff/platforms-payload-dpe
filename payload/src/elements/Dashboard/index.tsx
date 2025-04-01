import { type groupNavItems } from "@payloadcms/ui/shared";
import { AdminViewProps, ServerProps } from "payload";
import { FC, Fragment, Suspense } from "react";
import { DashboardBanner } from "./DashboardBanner";
import { DashboardGroup } from "./DashboardGroup";
import { MissingPostsGroup } from "./MissingPostsGroup";
import { MissingPostsLoading } from "./MissingPostsGroup/loading";

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
          <Suspense fallback={<MissingPostsLoading />}>
            <MissingPostsGroup adminRoute={adminRoute} payload={payload} />
          </Suspense>
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
