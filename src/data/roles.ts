import { 
  FileSpreadsheet, 
  Code, 
  Brain, 
  Database, 
  Server, 
  BarChart3, 
  Microscope, 
  Cpu
} from "lucide-react";

export interface Role {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgGradient: string;
  questions: string[];
}

export const roles: Role[] = [
  {
    id: "excel",
    title: "Excel",
    description: "Master spreadsheets, formulas, pivot tables, and data analysis in Microsoft Excel",
    icon: FileSpreadsheet,
    color: "text-excel",
    bgGradient: "from-green-500 to-emerald-600",
    questions: [
      "Explain the difference between VLOOKUP and XLOOKUP. When would you use each?",
      "How do you create a pivot table and what insights can you derive from it?",
      "Describe how you would use conditional formatting to highlight trends in data.",
      "What are array formulas and when would you use them?",
      "How would you use INDEX-MATCH as an alternative to VLOOKUP?",
      "Explain how to use Power Query for data transformation.",
      "What are the best practices for organizing large datasets in Excel?",
      "How do you create dynamic charts that update automatically?",
    ],
  },
  {
    id: "python",
    title: "Python",
    description: "Programming fundamentals, data structures, and Python libraries for data analysis",
    icon: Code,
    color: "text-python",
    bgGradient: "from-blue-500 to-cyan-600",
    questions: [
      "Explain the difference between a list and a tuple in Python.",
      "How do you handle exceptions in Python? Give an example.",
      "What is the difference between a shallow copy and a deep copy?",
      "Explain list comprehensions and when you would use them.",
      "How does Python's garbage collection work?",
      "What are decorators and how do you create one?",
      "Explain the concept of generators and their advantages.",
      "How do you work with pandas DataFrames for data manipulation?",
    ],
  },
  {
    id: "machine-learning",
    title: "Machine Learning",
    description: "Algorithms, model training, evaluation metrics, and ML best practices",
    icon: Brain,
    color: "text-ml",
    bgGradient: "from-purple-500 to-violet-600",
    questions: [
      "Explain the difference between supervised and unsupervised learning.",
      "What is overfitting and how do you prevent it?",
      "Describe the bias-variance tradeoff.",
      "How do you handle imbalanced datasets?",
      "Explain cross-validation and its importance.",
      "What are the differences between L1 and L2 regularization?",
      "How would you evaluate a classification model?",
      "Explain the concept of feature engineering and its importance.",
    ],
  },
  {
    id: "mysql",
    title: "MySQL",
    description: "Database design, queries, optimization, and MySQL-specific features",
    icon: Database,
    color: "text-mysql",
    bgGradient: "from-cyan-500 to-teal-600",
    questions: [
      "What is database normalization and why is it important?",
      "Explain the different types of JOINs in MySQL.",
      "How do you optimize a slow query?",
      "What are indexes and how do they improve performance?",
      "Explain the difference between InnoDB and MyISAM storage engines.",
      "How do you handle transactions in MySQL?",
      "What is a stored procedure and when would you use one?",
      "Explain the concept of database replication.",
    ],
  },
  {
    id: "sql",
    title: "SQL",
    description: "Standard SQL queries, aggregations, subqueries, and window functions",
    icon: Server,
    color: "text-sql",
    bgGradient: "from-rose-500 to-pink-600",
    questions: [
      "What is the difference between WHERE and HAVING clauses?",
      "Explain window functions and give an example.",
      "How do you write a subquery vs a CTE?",
      "What are aggregate functions and how do you use them?",
      "Explain the difference between UNION and UNION ALL.",
      "How do you handle NULL values in SQL?",
      "What is a self-join and when would you use it?",
      "Explain ACID properties in database transactions.",
    ],
  },
  {
    id: "powerbi",
    title: "Power BI",
    description: "Data visualization, DAX formulas, and business intelligence dashboards",
    icon: BarChart3,
    color: "text-powerbi",
    bgGradient: "from-yellow-500 to-orange-600",
    questions: [
      "How do you create relationships between tables in Power BI?",
      "Explain the difference between calculated columns and measures.",
      "What is DAX and how is it used in Power BI?",
      "How do you optimize a Power BI report for performance?",
      "Explain row-level security in Power BI.",
      "What are the different types of visualizations and when to use each?",
      "How do you refresh data in Power BI?",
      "Explain the concept of Power Query M language.",
    ],
  },
  {
    id: "data-science",
    title: "Data Science",
    description: "Statistical analysis, data exploration, visualization, and insights",
    icon: Microscope,
    color: "text-datascience",
    bgGradient: "from-teal-500 to-green-600",
    questions: [
      "Explain the data science lifecycle.",
      "How do you handle missing data in a dataset?",
      "What statistical tests would you use to compare two groups?",
      "Explain the central limit theorem and its importance.",
      "How do you detect and handle outliers?",
      "What is the difference between correlation and causation?",
      "Explain A/B testing and how you would implement it.",
      "How do you communicate technical findings to non-technical stakeholders?",
    ],
  },
  {
    id: "ml-engineering",
    title: "ML Engineering",
    description: "Model deployment, MLOps, pipelines, and production ML systems",
    icon: Cpu,
    color: "text-mlengg",
    bgGradient: "from-violet-500 to-purple-600",
    questions: [
      "How do you deploy a machine learning model to production?",
      "Explain the concept of MLOps and its importance.",
      "What is model versioning and why is it important?",
      "How do you monitor a model in production?",
      "Explain the concept of feature stores.",
      "How do you handle model retraining in production?",
      "What are the best practices for building ML pipelines?",
      "How do you ensure reproducibility in ML experiments?",
    ],
  },
];

export const getRoleById = (id: string): Role | undefined => {
  return roles.find((role) => role.id === id);
};
