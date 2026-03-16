import { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../api/client";
import PortfolioFormPanel from "../components/builder/PortfolioFormPanel";
import PreviewPanel from "../components/builder/PreviewPanel";
import CodeEditorPanel from "../components/builder/CodeEditorPanel";
import TemplateSelector from "../components/builder/TemplateSelector";
import { defaultPortfolioData } from "../templates/defaultData";
import { buildPortfolioHtml, extractPortfolioPayload } from "../templates/templateEngine";

function PortfolioBuilderPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const iframeRef = useRef(null);
  const isUpdatingFromCodeRef = useRef(false);

  const [portfolioId, setPortfolioId] = useState(id || "");
  const [portfolioData, setPortfolioData] = useState(defaultPortfolioData);
  const [templateId, setTemplateId] = useState(defaultPortfolioData.templateId || "template1");
  const [code, setCode] = useState(buildPortfolioHtml(defaultPortfolioData, defaultPortfolioData.templateId));
  const [mode, setMode] = useState("preview");
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [status, setStatus] = useState("");
  const [deploymentUrl, setDeploymentUrl] = useState("");
  const [codeChanged, setCodeChanged] = useState(false);

  useEffect(() => {
    setPortfolioId(id || "");
  }, [id]);

  useEffect(() => {
    async function loadPortfolio() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get(`/portfolios/${id}`);
        const portfolio = response.data.portfolio;
        setDeploymentUrl(portfolio.deployUrl || "");

        if (portfolio.customCode) {
          const payload = extractPortfolioPayload(portfolio.customCode);
          if (payload?.portfolioData) {
            isUpdatingFromCodeRef.current = true;
            setPortfolioData(payload.portfolioData);
            setTemplateId(payload.templateId || portfolio.templateId || "template1");
            setTimeout(() => {
              isUpdatingFromCodeRef.current = false;
            }, 0);
          } else {
            setPortfolioData({
              ...defaultPortfolioData,
              ...portfolio,
              templateId: portfolio.templateId || "template1"
            });
            setTemplateId(portfolio.templateId || "template1");
          }
          setCode(portfolio.customCode);
        } else {
          const mergedData = {
            ...defaultPortfolioData,
            ...portfolio,
            templateId: portfolio.templateId || "template1"
          };
          setPortfolioData(mergedData);
          setTemplateId(portfolio.templateId || "template1");
          setCode(buildPortfolioHtml(mergedData, portfolio.templateId || "template1"));
        }
      } catch (error) {
        setStatus(error.response?.data?.message || "Failed to load portfolio");
      } finally {
        setLoading(false);
      }
    }

    loadPortfolio();
  }, [id]);

  useEffect(() => {
    if (isUpdatingFromCodeRef.current) {
      return;
    }

    const nextCode = buildPortfolioHtml(portfolioData, templateId);
    setCode(nextCode);
    setCodeChanged(false);
  }, [portfolioData, templateId]);

  function handleDataChange(nextData) {
    setPortfolioData(nextData);
  }

  function handleCodeChange(nextCode) {
    setCode(nextCode);
    setCodeChanged(true);

    const payload = extractPortfolioPayload(nextCode);
    if (payload?.portfolioData) {
      isUpdatingFromCodeRef.current = true;
      setPortfolioData(payload.portfolioData);
      setTemplateId(payload.templateId || templateId);
      setTimeout(() => {
        isUpdatingFromCodeRef.current = false;
      }, 0);
    }
  }

  async function savePortfolio() {
    setSaving(true);
    setStatus("");
    try {
      const payload = {
        ...portfolioData,
        templateId,
        customCode: code,
        deployUrl: deploymentUrl,
        isPublished: Boolean(deploymentUrl)
      };

      if (portfolioId) {
        const response = await apiClient.put(`/portfolios/${portfolioId}`, payload);
        setStatus(response.data.message || "Portfolio updated");
        return portfolioId;
      }

      const response = await apiClient.post("/portfolios", payload);
      const createdId = response.data.portfolio?._id;
      if (createdId) {
        setPortfolioId(createdId);
        navigate(`/builder/${createdId}`, { replace: true });
      }
      setStatus(response.data.message || "Portfolio created");
      return createdId;
    } catch (error) {
      setStatus(error.response?.data?.message || "Failed to save portfolio");
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function deployPortfolio() {
    setDeploying(true);
    setStatus("");
    try {
      let currentPortfolioId = portfolioId;
      if (!currentPortfolioId) {
        currentPortfolioId = await savePortfolio();
      } else {
        await savePortfolio();
      }

      if (!currentPortfolioId) {
        setDeploying(false);
        return;
      }

      const response = await apiClient.post("/deploy", {
        portfolioId: currentPortfolioId,
        htmlCode: code
      });

      const url = response.data.deployment?.deploymentUrl || "";
      setDeploymentUrl(url);
      setStatus(url ? `Deployed successfully: ${url}` : "Deployment started");
    } catch (error) {
      setStatus(error.response?.data?.message || "Failed to deploy portfolio");
    } finally {
      setDeploying(false);
    }
  }

  async function downloadPdf() {
    try {
      const iframeDocument = iframeRef.current?.contentDocument;
      if (!iframeDocument) {
        setStatus("Preview is not ready for PDF export.");
        return;
      }

      const pdf = new jsPDF("p", "pt", "a4");
      await pdf.html(iframeDocument.body, {
        margin: [20, 20, 20, 20],
        autoPaging: "text",
        html2canvas: {
          scale: 0.55,
          useCORS: true
        }
      });

      const fileName = `${(portfolioData.profile?.name || "portfolio")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")}.pdf`;
      pdf.save(fileName);
      setStatus("PDF downloaded");
    } catch (error) {
      setStatus("Failed to generate PDF");
    }
  }

  if (loading) {
    return <div className="page-center">Loading portfolio builder...</div>;
  }

  return (
    <div className="builder-page">
      <div className="content-wrap">
        <div className="builder-header">
          <div>
            <h1>Portfolio Builder</h1>
            <p>Fill details in the form or edit code manually. Form and code stay synchronized via embedded data.</p>
            {codeChanged && (
              <p className="status-text">Manual code edits detected. Next form/template change will rebuild code.</p>
            )}
          </div>

          <div className="builder-actions">
            <TemplateSelector selectedTemplate={templateId} onSelectTemplate={setTemplateId} />
            <div className="mode-switch">
              <button
                type="button"
                className={`btn btn-small ${mode === "preview" ? "" : "btn-outline"}`}
                onClick={() => setMode("preview")}
              >
                Preview
              </button>
              <button
                type="button"
                className={`btn btn-small ${mode === "code" ? "" : "btn-outline"}`}
                onClick={() => setMode("code")}
              >
                Code Editor
              </button>
            </div>
            <div className="action-row">
              <button type="button" className="btn btn-small" disabled={saving} onClick={savePortfolio}>
                {saving ? "Saving..." : "Save"}
              </button>
              <button type="button" className="btn btn-small" disabled={deploying} onClick={deployPortfolio}>
                {deploying ? "Deploying..." : "Deploy"}
              </button>
              <button type="button" className="btn btn-small btn-outline" onClick={downloadPdf}>
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {deploymentUrl && (
          <div className="panel deploy-result">
            <p>
              Deployment URL:{" "}
              <a href={deploymentUrl} target="_blank" rel="noreferrer">
                {deploymentUrl}
              </a>
            </p>
          </div>
        )}
        {status && <p className="status-text">{status}</p>}

        <section className="builder-layout">
          <PortfolioFormPanel data={portfolioData} onChange={handleDataChange} />
          <div className="right-pane">
            {mode === "preview" ? (
              <PreviewPanel htmlCode={code} iframeRef={iframeRef} />
            ) : (
              <CodeEditorPanel code={code} onCodeChange={handleCodeChange} />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default PortfolioBuilderPage;
