import ErrorDetails from '@/components/ErrorDetails';
import InputUpload from '@/components/InputUpload';
import PlaceholderDetails from '@/components/PlaceholderDetails';
import ReplayBreakdown from '@/components/ReplayBreakdown';
import SectionLoading from '@/components/SectionLoading';
import { fetchMobDb, fetchReplayApi, fetchSkillDb } from '@/services';
import type { IMob, IReplayData, ISkill } from '@/types';
import React, { useEffect } from 'react';

export const Home = () => {
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [replayIsParsing, setReplayIsParsing] = React.useState<boolean>(false);
  const [isError, setIsError] = React.useState<boolean>(false);
  const [parsedReplay, setParsedReplay] = React.useState<IReplayData | null>(null);
  const [skillDb, setSkillDb] = React.useState<ISkill[] | null>(null);
  const [mobDb, setMobDb] = React.useState<IMob[] | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    setSelectedFiles(files);
  };

  const parseReplayFile = async (file: File, controller: AbortController) => {
    setReplayIsParsing(true);
    setIsError(false);

    try {
      const formData = new FormData();
      formData.append('replay', file);
      const resultReplay = await fetchReplayApi(formData, controller);

      setParsedReplay(resultReplay);
    } catch {
      setParsedReplay(null);
      setIsError(true);
    } finally {
      setReplayIsParsing(false);
    }
  };

  const handleClick = () => {
    const controller = new AbortController();

    if (selectedFiles.length > 0) {
      parseReplayFile(selectedFiles[0], controller);
    }

    return () => controller.abort('unmounted');
  };

  useEffect(() => {
    const controller = new AbortController();

    if (selectedFiles.length > 0) {
      parseReplayFile(selectedFiles[0], controller);
    }

    return () => controller.abort('unmounted');
  }, [selectedFiles]);

  useEffect(() => {
    const controller = new AbortController();
    if (skillDb === null || mobDb === null) {
      const retrieveMobAndSkillDb = async (controller: AbortController) => {
        try {
          const resultSkillDb = await fetchSkillDb(controller);
          const resultMobDb = await fetchMobDb(controller);

          return { resultSkillDb, resultMobDb };
        } catch {
          return { resultSkillDb: null, resultMobDb: null };
        }
      };

      retrieveMobAndSkillDb(controller).then(({ resultSkillDb, resultMobDb }) => {
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
      {isError && !replayIsParsing && <ErrorDetails retryOnClick={handleClick} />}
      {!!!parsedReplay && !replayIsParsing && !isError && <PlaceholderDetails />}
    </>
  );
};

export default Home;
