import InputUpload from '@/components/InputUpload';
import PlaceholderDetails from '@/components/PlaceholderDetails';
import ReplayBreakdown from '@/components/ReplayBreakdown';
import SectionLoading from '@/components/SectionLoading';
import { fetchMobDb, fetchReplay, fetchSkillDb } from '@/services';
import type { IMob, IReplayData, ISkill } from '@/types';
import { removeAllFileExtensions } from '@/utils';
import React, { useEffect } from 'react';

export const Home = () => {
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [replayIsParsing, setReplayIsParsing] = React.useState<boolean>(false);
  const [parsedReplay, setParsedReplay] = React.useState<IReplayData | null>(null);
  const [skillDb, setSkillDb] = React.useState<ISkill[] | null>(null);
  const [mobDb, setMobDb] = React.useState<IMob[] | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    setSelectedFiles(files);
  };

  useEffect(() => {
    const controller = new AbortController();

    if (selectedFiles.length > 0) {
      setReplayIsParsing(true);

      const apiCall = async (controller: AbortController) => {
        try {
          const resultReplay = await fetchReplay(
            `/external/output/${removeAllFileExtensions(selectedFiles[0].name)}.json`,
            controller
          );

          return resultReplay;
        } catch {
          return null;
        }
      };

      // api call here - todo
      apiCall(controller).then((resultReplay) => {
        setParsedReplay(resultReplay);
      });
    }

    return () => controller.abort('unmounted');
  }, [selectedFiles]);

  useEffect(() => {
    const controller = new AbortController();
    if (skillDb === null || mobDb === null) {
      const retrieveMobAndSkllDb = async (controller: AbortController) => {
        try {
          const resultSkillDb = await fetchSkillDb(controller);
          const resultMobDb = await fetchMobDb(controller);

          return { resultSkillDb, resultMobDb };
        } catch {
          return { resultSkillDb: null, resultMobDb: null };
        }
      };

      retrieveMobAndSkllDb(controller).then(({ resultSkillDb, resultMobDb }) => {
        setSkillDb(resultSkillDb);
        setMobDb(resultMobDb);
      });
    }

    return () => controller.abort('unmounted');
  }, []);

  useEffect(() => {
    if (parsedReplay !== null && skillDb !== null && mobDb !== null) {
      setReplayIsParsing(false);
    }

    return () => {};
  }, [parsedReplay, skillDb, mobDb]);

  return (
    <>
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1">
        <InputUpload
          onChange={handleFileUpload}
          selectedFiles={selectedFiles}
          accept={'.rrf'}
          multiple={false}
        />
      </div>
      {replayIsParsing && <SectionLoading label="Parsing your replay. Please wait." />}
      {parsedReplay && !replayIsParsing && (
        <ReplayBreakdown
          apiResponse={parsedReplay}
          skillDb={skillDb}
          mobDb={mobDb}
          fileName={selectedFiles[0].name}
        />
      )}
      {!!!parsedReplay && !replayIsParsing && <PlaceholderDetails />}
    </>
  );
};

export default Home;
