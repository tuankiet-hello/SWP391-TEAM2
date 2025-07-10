using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCareAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddRemindTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Reminds",
                columns: table => new
                {
                    RemindID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AccountID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PredictedStartDate = table.Column<DateOnly>(type: "date", nullable: false),
                    PredictedOvulationDate = table.Column<DateOnly>(type: "date", nullable: false),
                    FertileWindowStart = table.Column<DateOnly>(type: "date", nullable: false),
                    FertileWindowEnd = table.Column<DateOnly>(type: "date", nullable: false),
                    IsSent = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reminds", x => x.RemindID);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Reminds");
        }
    }
}
