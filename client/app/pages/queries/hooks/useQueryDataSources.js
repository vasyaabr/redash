import { filter, find, toString, includes } from "lodash";
import { useState, useMemo, useEffect } from "react";
import DataSource from "@/services/data-source";

export default function useQueryDataSources(query) {
  const [allDataSources, setAllDataSources] = useState([]);
  const [dataSourcesLoaded, setDataSourcesLoaded] = useState(false);
  const dataSources = useMemo(
    () =>
      filter(allDataSources, ds => {
        if (!ds.view_only) return true;
        const ids = [query.data_source_id].concat(query.additional_data_source_ids || []);
        return includes(ids, ds.id);
      }),
    [allDataSources, query.data_source_id, query.additional_data_source_ids]
  );
  const dataSource = useMemo(
    () => find(allDataSources, ds => toString(ds.id) === toString(query.data_source_id)) || null,
    [allDataSources, query.data_source_id]
  );

  useEffect(() => {
    let cancelDataSourceLoading = false;
    DataSource.query().then(data => {
      if (!cancelDataSourceLoading) {
        setDataSourcesLoaded(true);
        setAllDataSources(data);
      }
    });

    return () => {
      cancelDataSourceLoading = true;
    };
  }, []);

  return useMemo(() => ({ dataSourcesLoaded, dataSources, dataSource }), [dataSourcesLoaded, dataSources, dataSource]);
}
