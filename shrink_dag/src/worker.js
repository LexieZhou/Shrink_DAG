const {useState, useCallback, useEffect} = require('react');

const useWebWorker = (workerFunction, inputData) => {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const memoizedWorkerFunction = useCallback(workerFunction, []);

    useEffect(() => {
        setLoading(true);
        setError(null);

        try {
            const code = memoizedWorkerFunction.toString();
            const blob = new Blob([`(${code})()`], {type: 'application/javascript'});
            const workerScriptUrl = URL.createObjectURL(blob);
            const worker = new Worker(workerScriptUrl);

            worker.postMessage(inputData);
            worker.onmessage = (e) => {
                setResult(e.data);
                setLoading(false);
            };
            worker.onerror = (e) => {
                setError(e.message);
                setLoading(false);
            };

            return () => {
                worker.terminate();
                URL.revokeObjectURL(workerScriptUrl);
            }
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }

    }, [inputData, memoizedWorkerFunction]);

    return {result, error, loading};

};

export default useWebWorker;